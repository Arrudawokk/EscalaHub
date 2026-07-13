import MercadoPagoConfig, { Payment, WebhookSignatureValidator } from "mercadopago";
import { PaymentGatewayError, type PaymentGateway, type WebhookVerificationInput } from "./interfaces";
import type { CreatePaymentInput, PaymentResult, WebhookNotification } from "./types";
import { buildIdempotencyKey, mapMercadoPagoStatus } from "./utils";

/**
 * Único arquivo do projeto que conhece o SDK do Mercado Pago.
 *
 * Nada fora de `lib/payments/` (nem componentes, nem rotas de API) deve
 * importar este módulo diretamente — sempre utilizar `getPaymentGateway()`
 * em `gateway.ts`.
 */
export class MercadoPagoGateway implements PaymentGateway {
  readonly id = "mercado-pago";

  private readonly client: Payment;
  private readonly webhookSecret: string;

  constructor() {
    const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;
    const webhookSecret = process.env.MERCADO_PAGO_WEBHOOK_SECRET;

    if (!accessToken) throw new PaymentGatewayError("MERCADO_PAGO_ACCESS_TOKEN não configurado.");
    if (!webhookSecret) throw new PaymentGatewayError("MERCADO_PAGO_WEBHOOK_SECRET não configurado.");

    const config = new MercadoPagoConfig({ accessToken, options: { timeout: 8000 } });
    this.client = new Payment(config);
    this.webhookSecret = webhookSecret;
  }

  async createPayment(input: CreatePaymentInput): Promise<PaymentResult> {
    try {
      const response = await this.client.create({
        body: {
          transaction_amount: input.amount,
          description: input.productSlug,
          external_reference: input.externalReference,
          notification_url: input.notificationUrl,
          payment_method_id: input.method === "pix" ? "pix" : input.paymentMethodId,
          token: input.method === "card" ? input.cardToken : undefined,
          installments: input.method === "card" ? input.installments : undefined,
          payer: {
            email: input.payer.email,
            first_name: input.payer.firstName,
            last_name: input.payer.lastName,
            identification: { type: "CPF", number: input.payer.documentNumber },
          },
        },
        requestOptions: { idempotencyKey: buildIdempotencyKey(input.externalReference) },
      });

      return this.toPaymentResult(response);
    } catch (error) {
      throw new PaymentGatewayError("Falha ao criar pagamento no Mercado Pago.", error);
    }
  }

  async getPayment(gatewayPaymentId: string): Promise<PaymentResult> {
    try {
      const response = await this.client.get({ id: Number(gatewayPaymentId) });
      return this.toPaymentResult(response);
    } catch (error) {
      throw new PaymentGatewayError("Falha ao consultar pagamento no Mercado Pago.", error);
    }
  }

  async parseWebhook(input: WebhookVerificationInput): Promise<WebhookNotification | null> {
    const dataId = input.searchParams.get("data.id") ?? input.searchParams.get("id");
    const topic = input.searchParams.get("type") ?? input.searchParams.get("topic");

    if (!dataId || (topic && topic !== "payment")) return null;

    WebhookSignatureValidator.validate({
      xSignature: input.signatureHeader,
      xRequestId: input.requestIdHeader,
      dataId,
      secret: this.webhookSecret,
      toleranceSeconds: 300,
    });

    const result = await this.getPayment(dataId);

    return {
      gatewayPaymentId: result.gatewayPaymentId,
      status: result.status,
      statusDetail: result.statusDetail,
      externalReference: result.externalReference,
      method: result.method,
    };
  }

  private toPaymentResult(response: Awaited<ReturnType<Payment["get"]>>): PaymentResult {
    if (!response.id) throw new PaymentGatewayError("Resposta do Mercado Pago sem identificador de pagamento.");

    const transactionData = response.point_of_interaction?.transaction_data;
    const isPix = response.payment_method_id === "pix";

    return {
      gatewayPaymentId: String(response.id),
      status: mapMercadoPagoStatus(response.status),
      statusDetail: response.status_detail,
      method: isPix ? "pix" : "card",
      externalReference: response.external_reference ?? "",
      pix:
        isPix && transactionData?.qr_code && transactionData?.qr_code_base64
          ? {
              qrCode: transactionData.qr_code,
              qrCodeBase64: transactionData.qr_code_base64,
              ticketUrl: transactionData.ticket_url,
            }
          : undefined,
    };
  }
}
