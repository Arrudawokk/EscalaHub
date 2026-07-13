import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { getProductBySlug } from "@/lib/catalog";
import { getPaymentGateway } from "@/lib/payments/gateway";
import { PaymentGatewayError } from "@/lib/payments/interfaces";
import { getOrderStore } from "@/lib/payments/orderStore";
import type { CreatePaymentInput } from "@/lib/payments/types";
import { isValidCpf, isValidEmail, onlyDigits, splitFullName } from "@/lib/payments/utils";
import { SITE_URL } from "@/lib/site";

export const runtime = "nodejs";

type CreatePaymentBody = {
  productSlug?: string;
  method?: "pix" | "card";
  payer?: { name?: string; email?: string; document?: string };
  card?: { token?: string; paymentMethodId?: string; installments?: number };
};

function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

export async function POST(request: Request) {
  let body: CreatePaymentBody;
  try {
    body = await request.json();
  } catch {
    return badRequest("Corpo da requisição inválido.");
  }

  const productSlug = body.productSlug;
  const product = productSlug ? getProductBySlug(productSlug) : undefined;
  if (!product) return badRequest("Produto não encontrado no catálogo.");

  if (body.method !== "pix" && body.method !== "card") return badRequest("Forma de pagamento inválida.");

  const name = body.payer?.name?.trim();
  const email = body.payer?.email?.trim();
  const document = body.payer?.document ? onlyDigits(body.payer.document) : "";

  if (!name) return badRequest("Nome é obrigatório.");
  if (!email || !isValidEmail(email)) return badRequest("E-mail inválido.");
  if (!isValidCpf(document)) return badRequest("CPF inválido.");

  const { firstName, lastName } = splitFullName(name);
  const externalReference = randomUUID();
  const notificationUrl = `${SITE_URL}/api/payments/webhook`;

  const basePayload = {
    productSlug: product.slug,
    // O valor sempre vem do catálogo — nunca do cliente.
    amount: product.price,
    currency: product.currency,
    payer: { email, firstName, lastName, documentNumber: document },
    externalReference,
    notificationUrl,
  };

  let input: CreatePaymentInput;
  if (body.method === "pix") {
    input = { ...basePayload, method: "pix" };
  } else {
    const cardToken = body.card?.token;
    const paymentMethodId = body.card?.paymentMethodId;
    const installments = body.card?.installments ?? 1;
    if (!cardToken || !paymentMethodId) return badRequest("Dados do cartão inválidos.");
    input = { ...basePayload, method: "card", cardToken, paymentMethodId, installments };
  }

  try {
    const gateway = getPaymentGateway();
    const result = await gateway.createPayment(input);

    const orderStore = getOrderStore();
    await orderStore.create({
      externalReference,
      productSlug: product.slug,
      amount: product.price,
      currency: product.currency,
      payerEmail: email,
      method: body.method,
      status: result.status,
      gatewayPaymentId: result.gatewayPaymentId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        orderId: externalReference,
        status: result.status,
        pix: result.pix,
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof PaymentGatewayError) {
      return NextResponse.json({ error: "Não foi possível processar o pagamento. Tente novamente." }, { status: 502 });
    }
    throw error;
  }
}
