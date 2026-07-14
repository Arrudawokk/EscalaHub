import { NextResponse } from "next/server";
import { getPaymentGateway } from "@/lib/payments/gateway";
import { InvalidWebhookRequestError, PaymentGatewayError } from "@/lib/payments/interfaces";
import { getOrderStore, type OrderRecord } from "@/lib/payments/orderStore";
import type { WebhookNotification } from "@/lib/payments/types";

export const runtime = "nodejs";

const NO_STORE_HEADERS = { "Cache-Control": "no-store, max-age=0" };

function json(body: object, status: number, extraHeaders?: Record<string, string>) {
  return NextResponse.json(body, { status, headers: { ...NO_STORE_HEADERS, ...extraHeaders } });
}

function matchesOrder(order: OrderRecord, notification: WebhookNotification): boolean {
  return (
    order.externalReference === notification.externalReference &&
    (!order.gatewayPaymentId || order.gatewayPaymentId === notification.gatewayPaymentId) &&
    order.method === notification.method &&
    order.currency === notification.currency &&
    Math.round(order.amount * 100) === Math.round(notification.amount * 100) &&
    Boolean(notification.payerEmail) &&
    order.payerEmail.toLowerCase() === notification.payerEmail?.toLowerCase()
  );
}

/**
 * A assinatura e a janela temporal são validadas antes de o pagamento ser
 * consultado novamente no gateway. O payload recebido nunca é fonte de verdade.
 */
export async function POST(request: Request) {
  const searchParams = new URL(request.url).searchParams;

  try {
    const notification = await getPaymentGateway().parseWebhook({
      signatureHeader: request.headers.get("x-signature"),
      requestIdHeader: request.headers.get("x-request-id"),
      searchParams,
    });

    if (!notification) return json({ received: true }, 200);

    const orderStore = getOrderStore();
    const order = await orderStore.getByExternalReference(notification.externalReference);
    if (!order) return json({ received: true }, 200);
    if (!matchesOrder(order, notification)) return json({ error: "Pagamento não corresponde ao pedido." }, 422);

    const updated = order.gatewayPaymentId
      ? await orderStore.updateStatusByGatewayPaymentId(notification.gatewayPaymentId, notification.status)
      : await orderStore.attachGatewayPaymentId(order.externalReference, notification.gatewayPaymentId, notification.status);

    if (!updated) return json({ error: "Não foi possível reconciliar o pagamento." }, 409);
    return json({ received: true }, 200);
  } catch (error) {
    if (error instanceof InvalidWebhookRequestError) return json({ error: "Assinatura inválida." }, 401);
    if (error instanceof PaymentGatewayError) {
      return json({ error: "Gateway temporariamente indisponível." }, 503, { "Retry-After": "10" });
    }
    return json({ error: "Não foi possível processar a notificação." }, 500);
  }
}
