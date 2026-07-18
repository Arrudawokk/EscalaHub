import "server-only";

import { getProductBySlug, type Product } from "@/lib/catalog";
import { hasDeploymentSiteUrl, SITE_URL } from "@/lib/site";
import { getPaymentGateway } from "./gateway";
import { getOrderStore, type OrderRecord, type OrderStore } from "./orderStore";
import { reconcilePayment } from "./reconciliation";
import type { CreatePaymentInput, PaymentResult } from "./types";
import { splitFullName } from "./utils";

export type CheckoutResult = {
  order: OrderRecord;
  payment?: PaymentResult;
  reused: boolean;
};

export class CheckoutConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CheckoutConflictError";
  }
}

function checkoutUrls(productSlug: string, orderId: string): { successUrl: string; cancelUrl: string } | null {
  if (!hasDeploymentSiteUrl) return null;

  try {
    const successUrl = new URL("/checkout", SITE_URL);
    successUrl.searchParams.set("product", productSlug);
    successUrl.searchParams.set("orderId", orderId);
    successUrl.searchParams.set("stripe", "success");
    successUrl.searchParams.set("session_id", "{CHECKOUT_SESSION_ID}");

    const cancelUrl = new URL("/checkout", SITE_URL);
    cancelUrl.searchParams.set("product", productSlug);
    cancelUrl.searchParams.set("orderId", orderId);
    cancelUrl.searchParams.set("stripe", "cancelled");

    return {
      successUrl: successUrl.toString().replace("%7BCHECKOUT_SESSION_ID%7D", "{CHECKOUT_SESSION_ID}"),
      cancelUrl: cancelUrl.toString(),
    };
  } catch {
    return null;
  }
}

function belongsToCheckout(order: OrderRecord, productSlug: string, payerEmail: string): boolean {
  return (
    order.productSlug === productSlug &&
    order.gateway === "stripe" &&
    order.method === "stripe_checkout" &&
    order.payerEmail.toLowerCase() === payerEmail.toLowerCase()
  );
}

function initialOrder(product: Product, payerName: string, payerEmail: string, externalReference: string): OrderRecord {
  const now = new Date().toISOString();
  return {
    externalReference,
    productSlug: product.slug,
    amount: product.price,
    currency: product.currency,
    payerEmail,
    payerName,
    gateway: "stripe",
    method: "stripe_checkout",
    status: "pending",
    accessStatus: "pending",
    createdAt: now,
    updatedAt: now,
  };
}

export async function inspectCheckoutOrder(order: OrderRecord, orderStore: OrderStore = getOrderStore()): Promise<CheckoutResult> {
  if (!order.gatewayPaymentId) return { order, reused: true };

  const payment = await getPaymentGateway().getPayment(order.gatewayPaymentId);
  const reconciled = await reconcilePayment(orderStore, order, payment);
  if (!reconciled.order) throw new CheckoutConflictError("O pagamento não corresponde ao pedido informado.");
  return { order: reconciled.order, payment, reused: true };
}

async function findReusableCheckout(product: Product, payerEmail: string, orderStore: OrderStore): Promise<CheckoutResult | null> {
  const candidates = (await orderStore.listByPayerEmail(payerEmail)).filter(
    (order) =>
      order.productSlug === product.slug &&
      order.gateway === "stripe" &&
      order.method === "stripe_checkout" &&
      Boolean(order.gatewayPaymentId) &&
      (order.status === "pending" || order.status === "in_process"),
  );

  for (const candidate of candidates) {
    const inspected = await inspectCheckoutOrder(candidate, orderStore);
    if (
      inspected.order.status === "approved" ||
      inspected.order.status === "pending" ||
      inspected.order.status === "in_process"
    ) {
      return inspected;
    }
  }

  return null;
}

export async function createOrReuseCheckout(input: {
  product: Product;
  payerName: string;
  payerEmail: string;
  externalReference: string;
}): Promise<CheckoutResult> {
  const orderStore = getOrderStore();
  const existingByReference = await orderStore.getByExternalReference(input.externalReference);

  if (existingByReference) {
    if (!belongsToCheckout(existingByReference, input.product.slug, input.payerEmail)) {
      throw new CheckoutConflictError("A chave de idempotência já foi utilizada em outro pedido.");
    }
    if (existingByReference.gatewayPaymentId) return inspectCheckoutOrder(existingByReference, orderStore);
  } else {
    const reusable = await findReusableCheckout(input.product, input.payerEmail, orderStore);
    if (reusable) return reusable;
  }

  const urls = checkoutUrls(input.product.slug, input.externalReference);
  if (!urls) throw new CheckoutConflictError("Checkout temporariamente indisponível.");

  const pendingOrder = existingByReference ?? initialOrder(input.product, input.payerName, input.payerEmail, input.externalReference);
  if (!existingByReference) {
    const created = await orderStore.create(pendingOrder);
    if (!created) {
      const concurrent = await orderStore.getByExternalReference(input.externalReference);
      if (!concurrent || !belongsToCheckout(concurrent, input.product.slug, input.payerEmail)) {
        throw new CheckoutConflictError("A chave de idempotência já foi utilizada em outro pedido.");
      }
      if (concurrent.gatewayPaymentId) return inspectCheckoutOrder(concurrent, orderStore);
    }
  }

  const { firstName, lastName } = splitFullName(input.payerName);
  const paymentInput: CreatePaymentInput = {
    productSlug: input.product.slug,
    amount: input.product.price,
    currency: input.product.currency,
    payer: { email: input.payerEmail, firstName, lastName },
    externalReference: input.externalReference,
    method: "stripe_checkout",
    ...urls,
  };
  const payment = await getPaymentGateway().createPayment(paymentInput);
  const currentOrder = (await orderStore.getByExternalReference(input.externalReference)) ?? pendingOrder;
  const reconciled = await reconcilePayment(orderStore, currentOrder, payment);
  if (!reconciled.order) throw new CheckoutConflictError("Não foi possível reconciliar o pagamento com o pedido.");

  return { order: reconciled.order, payment, reused: false };
}

export async function cancelCheckoutOrder(orderId: string): Promise<CheckoutResult> {
  const orderStore = getOrderStore();
  const order = await orderStore.getByExternalReference(orderId);
  if (!order) throw new CheckoutConflictError("Pedido não encontrado.");
  if (order.gateway !== "stripe" || order.method !== "stripe_checkout") {
    throw new CheckoutConflictError("O pedido não pertence ao checkout Stripe.");
  }

  const inspected = await inspectCheckoutOrder(order, orderStore);
  if (inspected.order.status === "approved" || inspected.order.status === "cancelled") return inspected;
  if (!inspected.payment?.checkoutUrl || !inspected.order.gatewayPaymentId) return inspected;

  const cancelledPayment = await getPaymentGateway().cancelPayment(inspected.order.gatewayPaymentId);
  const reconciled = await reconcilePayment(orderStore, inspected.order, cancelledPayment);
  if (!reconciled.order) throw new CheckoutConflictError("Não foi possível cancelar o pedido.");
  return { order: reconciled.order, payment: cancelledPayment, reused: true };
}

export async function renewCheckoutOrder(orderId: string, externalReference: string): Promise<CheckoutResult> {
  const orderStore = getOrderStore();
  const order = await orderStore.getByExternalReference(orderId);
  if (!order) throw new CheckoutConflictError("Pedido não encontrado.");
  if (order.gateway !== "stripe" || order.method !== "stripe_checkout") {
    throw new CheckoutConflictError("O pedido não pertence ao checkout Stripe.");
  }

  const inspected = await inspectCheckoutOrder(order, orderStore);
  if (inspected.payment?.checkoutUrl) return inspected;
  if (
    inspected.order.status === "approved" ||
    inspected.order.status === "pending" ||
    inspected.order.status === "in_process"
  ) {
    return inspected;
  }
  if (inspected.order.status !== "cancelled" && inspected.order.status !== "rejected") {
    throw new CheckoutConflictError("Este pedido não pode gerar uma nova tentativa de pagamento.");
  }

  const product = getProductBySlug(inspected.order.productSlug);
  if (!product) throw new CheckoutConflictError("Produto não encontrado no catálogo.");

  return createOrReuseCheckout({
    product,
    payerName: inspected.order.payerName?.trim() || "Cliente EscalaHub",
    payerEmail: inspected.order.payerEmail,
    externalReference,
  });
}
