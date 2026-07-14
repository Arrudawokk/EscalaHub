import { NextResponse } from "next/server";
import { getOrderStore } from "@/lib/payments/orderStore";

export const runtime = "nodejs";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const RESPONSE_OPTIONS = { headers: { "Cache-Control": "no-store, max-age=0" } };

export async function GET(request: Request) {
  const orderId = new URL(request.url).searchParams.get("orderId")?.trim();
  if (!orderId || !UUID_PATTERN.test(orderId)) {
    return NextResponse.json({ error: "orderId inválido." }, { status: 400, ...RESPONSE_OPTIONS });
  }

  const order = await getOrderStore().getByExternalReference(orderId);
  if (!order) return NextResponse.json({ error: "Pedido não encontrado." }, { status: 404, ...RESPONSE_OPTIONS });

  return NextResponse.json({ status: order.status }, RESPONSE_OPTIONS);
}
