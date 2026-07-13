import { NextResponse } from "next/server";
import { getPaymentGateway } from "@/lib/payments/gateway";
import { getOrderStore } from "@/lib/payments/orderStore";

export const runtime = "nodejs";

/**
 * Recebe as notificações de pagamento do Mercado Pago.
 *
 * O corpo enviado pelo gateway nunca é utilizado como fonte de verdade: a
 * assinatura é validada e, em seguida, o pagamento é buscado novamente
 * diretamente na API do Mercado Pago antes de qualquer atualização de status.
 */
export async function POST(request: Request) {
  const searchParams = new URL(request.url).searchParams;

  try {
    const gateway = getPaymentGateway();
    const notification = await gateway.parseWebhook({
      signatureHeader: request.headers.get("x-signature"),
      requestIdHeader: request.headers.get("x-request-id"),
      searchParams,
    });

    if (!notification) return NextResponse.json({ received: true }, { status: 200 });

    const orderStore = getOrderStore();
    const order = notification.externalReference
      ? await orderStore.getByExternalReference(notification.externalReference)
      : await orderStore.getByGatewayPaymentId(notification.gatewayPaymentId);

    if (!order) return NextResponse.json({ received: true }, { status: 200 });

    if (!order.gatewayPaymentId) {
      await orderStore.attachGatewayPaymentId(order.externalReference, notification.gatewayPaymentId, notification.status);
    } else {
      await orderStore.updateStatusByGatewayPaymentId(notification.gatewayPaymentId, notification.status);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch {
    // Assinatura ausente, malformada ou inválida — a requisição é rejeitada
    // sem revelar detalhes internos.
    return NextResponse.json({ error: "Assinatura inválida." }, { status: 401 });
  }
}
