import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { AccountStoreUnavailableError } from "@/lib/account/store";
import { issueCustomerSession } from "@/lib/account/session";
import { getProductBySlug } from "@/lib/catalog";
import { CheckoutConflictError, createOrReuseCheckout } from "@/lib/payments/checkout";
import { getDeliveryDetails } from "@/lib/payments/delivery";
import { PaymentGatewayError } from "@/lib/payments/interfaces";
import { OrderStoreUnavailableError, type OrderRecord } from "@/lib/payments/orderStore";
import type { PaymentResult } from "@/lib/payments/types";
import { isValidEmail } from "@/lib/payments/utils";
import { logger } from "@/lib/server/logger";
import { isAllowedOrigin } from "@/lib/server/origin";

export const runtime = "nodejs";

const MAX_BODY_BYTES = 16_384;
const NO_STORE_HEADERS = { "Cache-Control": "no-store, max-age=0" };
const UUID_V4_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type CreatePaymentBody = {
  productSlug?: string;
  payer?: { name?: string; email?: string };
};

function json(body: object, status: number) {
  return NextResponse.json(body, { status, headers: NO_STORE_HEADERS });
}

function badRequest(message: string) {
  return json({ error: message }, 400);
}

async function paymentResponse(result: PaymentResult, order: OrderRecord, status = 201) {
  if (order.status === "approved" && order.accessStatus === "granted") {
    try {
      await issueCustomerSession(order);
    } catch (error) {
      if (!(error instanceof AccountStoreUnavailableError)) throw error;
      logger.warn("account.session_deferred", { orderId: order.externalReference });
    }
  }
  return json(
    {
      orderId: order.externalReference,
      status: order.status,
      checkoutUrl: result.checkoutUrl,
      delivery: getDeliveryDetails(order),
      purchaseEventId: order.status === "approved" ? order.externalReference : undefined,
      accountUrl: order.status === "approved" ? "/account" : undefined,
    },
    status,
  );
}

export async function POST(request: Request) {
  if (!isAllowedOrigin(request)) return json({ error: "Origem da requisição não autorizada." }, 403);

  const declaredLength = Number(request.headers.get("content-length") ?? 0);
  if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES) return json({ error: "Requisição muito grande." }, 413);

  let body: CreatePaymentBody;
  try {
    const rawBody = await request.text();
    if (Buffer.byteLength(rawBody, "utf8") > MAX_BODY_BYTES) return json({ error: "Requisição muito grande." }, 413);
    const parsed: unknown = JSON.parse(rawBody);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return badRequest("Corpo da requisição inválido.");
    body = parsed as CreatePaymentBody;
  } catch {
    return badRequest("Corpo da requisição inválido.");
  }

  const productSlug = body.productSlug;
  const product = productSlug ? getProductBySlug(productSlug) : undefined;
  if (!product) return badRequest("Produto não encontrado no catálogo.");

  const name = body.payer?.name?.trim();
  const email = body.payer?.email?.trim().toLowerCase();
  if (!name || name.length < 2 || name.length > 120) return badRequest("Nome inválido.");
  if (!email || email.length > 254 || !isValidEmail(email)) return badRequest("E-mail inválido.");

  const clientIdempotencyKey = request.headers.get("x-idempotency-key")?.trim();
  if (clientIdempotencyKey && !UUID_V4_PATTERN.test(clientIdempotencyKey)) return badRequest("Chave de idempotência inválida.");

  const externalReference = clientIdempotencyKey ?? randomUUID();

  try {
    const result = await createOrReuseCheckout({
      product,
      payerName: name,
      payerEmail: email,
      externalReference,
    });
    if (!result.payment) return json({ error: "Não foi possível iniciar o pagamento." }, 409);

    logger.info(result.reused ? "payment.reused" : "payment.created", {
      orderId: result.order.externalReference,
      gatewayPaymentId: result.payment.gatewayPaymentId,
      status: result.order.status,
    });
    return await paymentResponse(result.payment, result.order, result.reused ? 200 : 201);
  } catch (error) {
    if (error instanceof CheckoutConflictError) {
      logger.warn("payment.checkout_conflict", { orderId: externalReference });
      return json({ error: error.message }, 409);
    }
    if (error instanceof OrderStoreUnavailableError) {
      logger.error("payment.store_unavailable", { orderId: externalReference });
      return json({ error: "Checkout temporariamente indisponível." }, 503);
    }
    if (error instanceof PaymentGatewayError) {
      logger.warn("payment.gateway_unavailable", { orderId: externalReference });
      return json({ error: "Não foi possível iniciar o pagamento. Tente novamente." }, 502);
    }
    logger.error("payment.create_failed", { orderId: externalReference });
    return json({ error: "Não foi possível iniciar o pagamento." }, 500);
  }
}
