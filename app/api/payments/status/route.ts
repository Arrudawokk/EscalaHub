import { NextResponse } from "next/server";
import { AccountStoreUnavailableError } from "@/lib/account/store";
import { issueCustomerSession } from "@/lib/account/session";
import {
  cancelCheckoutOrder,
  CheckoutConflictError,
  inspectCheckoutOrder,
  renewCheckoutOrder,
  type CheckoutResult,
} from "@/lib/payments/checkout";
import { getDeliveryDetails } from "@/lib/payments/delivery";
import { PaymentGatewayError } from "@/lib/payments/interfaces";
import { getOrderStore, OrderStoreUnavailableError } from "@/lib/payments/orderStore";
import { logger } from "@/lib/server/logger";
import { isAllowedOrigin } from "@/lib/server/origin";

export const runtime = "nodejs";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const UUID_V4_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const RESPONSE_OPTIONS = { headers: { "Cache-Control": "no-store, max-age=0" } };
const MAX_BODY_BYTES = 4_096;

type RecoveryAction = "cancel" | "renew";
type RecoveryBody = { orderId?: string; action?: RecoveryAction };

function json(body: object, status = 200) {
  return NextResponse.json(body, { status, ...RESPONSE_OPTIONS });
}

async function checkoutResponse(result: CheckoutResult, status = 200) {
  const { order, payment } = result;
  if (order.status === "approved" && order.accessStatus === "granted") {
    try {
      await issueCustomerSession(order);
    } catch (error) {
      if (!(error instanceof AccountStoreUnavailableError)) throw error;
      logger.warn("account.session_deferred", { orderId: order.externalReference });
    }
  }

  const checkoutUrl =
    (order.status === "pending" || order.status === "in_process") && payment?.checkoutUrl
      ? payment.checkoutUrl
      : undefined;
  const expired = payment?.statusDetail?.startsWith("expired:") ?? false;
  const cancelled = order.status === "cancelled";
  const approved = order.status === "approved";

  return json(
    {
      orderId: order.externalReference,
      status: order.status,
      checkoutUrl,
      expired,
      cancelled,
      approved,
      canResume: Boolean(checkoutUrl),
      canRenew: !checkoutUrl && (cancelled || order.status === "rejected"),
      delivery: getDeliveryDetails(order),
      purchaseEventId: approved ? order.externalReference : undefined,
      accountUrl: approved ? "/account" : undefined,
    },
    status,
  );
}

function errorResponse(error: unknown, orderId: string | undefined) {
  if (error instanceof CheckoutConflictError) {
    logger.warn("payment.recovery_conflict", { orderId });
    return json({ error: error.message }, error.message === "Pedido não encontrado." ? 404 : 409);
  }
  if (error instanceof OrderStoreUnavailableError) {
    logger.error("payment.recovery_store_unavailable", { orderId });
    return json({ error: "Consulta temporariamente indisponível." }, 503);
  }
  if (error instanceof PaymentGatewayError) {
    logger.warn("payment.recovery_gateway_unavailable", { orderId });
    return json({ error: "Não foi possível consultar o pagamento agora." }, 502);
  }
  logger.error("payment.recovery_failed", { orderId });
  return json({ error: "Não foi possível recuperar o pagamento." }, 500);
}

export async function GET(request: Request) {
  const orderId = new URL(request.url).searchParams.get("orderId")?.trim();
  if (!orderId || !UUID_PATTERN.test(orderId)) return json({ error: "orderId inválido." }, 400);

  try {
    const order = await getOrderStore().getByExternalReference(orderId);
    if (!order) return json({ error: "Pedido não encontrado." }, 404);
    return await checkoutResponse(await inspectCheckoutOrder(order));
  } catch (error) {
    return errorResponse(error, orderId);
  }
}

export async function POST(request: Request) {
  if (!isAllowedOrigin(request)) return json({ error: "Origem da requisição não autorizada." }, 403);

  const declaredLength = Number(request.headers.get("content-length") ?? 0);
  if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES) {
    return json({ error: "Requisição muito grande." }, 413);
  }

  let body: RecoveryBody;
  try {
    const rawBody = await request.text();
    if (Buffer.byteLength(rawBody, "utf8") > MAX_BODY_BYTES) return json({ error: "Requisição muito grande." }, 413);
    const parsed: unknown = JSON.parse(rawBody);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return json({ error: "Corpo da requisição inválido." }, 400);
    body = parsed as RecoveryBody;
  } catch {
    return json({ error: "Corpo da requisição inválido." }, 400);
  }

  const orderId = body.orderId?.trim();
  if (!orderId || !UUID_PATTERN.test(orderId)) return json({ error: "orderId inválido." }, 400);
  if (body.action !== "cancel" && body.action !== "renew") return json({ error: "Ação inválida." }, 400);

  try {
    if (body.action === "cancel") {
      const result = await cancelCheckoutOrder(orderId);
      logger.info(result.order.status === "cancelled" ? "payment.cancelled_by_customer" : "payment.cancel_not_applied", {
        orderId: result.order.externalReference,
        gatewayPaymentId: result.payment?.gatewayPaymentId,
        status: result.order.status,
      });
      return await checkoutResponse(result);
    }

    const idempotencyKey = request.headers.get("x-idempotency-key")?.trim();
    if (!idempotencyKey || !UUID_V4_PATTERN.test(idempotencyKey)) {
      return json({ error: "Chave de idempotência inválida." }, 400);
    }

    const result = await renewCheckoutOrder(orderId, idempotencyKey);
    logger.info(result.reused ? "payment.recovery_reused" : "payment.recovery_created", {
      previousOrderId: orderId,
      orderId: result.order.externalReference,
      gatewayPaymentId: result.payment?.gatewayPaymentId,
      status: result.order.status,
    });
    return await checkoutResponse(result, result.reused ? 200 : 201);
  } catch (error) {
    return errorResponse(error, orderId);
  }
}
