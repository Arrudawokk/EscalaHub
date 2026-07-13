import { NextResponse } from "next/server";
import { getOrderStore } from "@/lib/payments/orderStore";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const orderId = new URL(request.url).searchParams.get("orderId");
  if (!orderId) return NextResponse.json({ error: "orderId é obrigatório." }, { status: 400 });

  const order = await getOrderStore().getByExternalReference(orderId);
  if (!order) return NextResponse.json({ error: "Pedido não encontrado." }, { status: 404 });

  return NextResponse.json({ status: order.status });
}
