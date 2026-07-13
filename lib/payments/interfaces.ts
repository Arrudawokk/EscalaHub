import type { CreatePaymentInput, PaymentResult, WebhookNotification } from "./types";

/**
 * Dados brutos de uma requisição de webhook, necessários para validar a
 * assinatura antes de confiar em qualquer informação do payload.
 */
export type WebhookVerificationInput = {
  /** Cabeçalho de assinatura enviado pelo gateway. */
  signatureHeader: string | null;
  /** Cabeçalho de identificação da requisição, usado na validação da assinatura. */
  requestIdHeader: string | null;
  /** Parâmetros de busca da URL de notificação (ex.: `data.id`, `topic`). */
  searchParams: URLSearchParams;
};

/**
 * Contrato que todo gateway de pagamento precisa implementar.
 *
 * A aplicação nunca deve importar um gateway concreto (ex.: `mercadoPago.ts`)
 * diretamente. Toda comunicação deve passar por esta interface, obtida via
 * `getPaymentGateway()` em `gateway.ts`.
 */
export interface PaymentGateway {
  readonly id: string;

  /** Cria uma cobrança (Pix ou cartão) com os dados reais do produto. */
  createPayment(input: CreatePaymentInput): Promise<PaymentResult>;

  /** Busca o status autoritativo de um pagamento diretamente no gateway. */
  getPayment(gatewayPaymentId: string): Promise<PaymentResult>;

  /**
   * Valida a assinatura de uma notificação de webhook e, em caso de sucesso,
   * resolve a notificação buscando o pagamento real no gateway (nunca
   * confiando apenas no corpo recebido).
   *
   * Retorna `null` quando a requisição não corresponde a um evento de
   * pagamento reconhecido.
   */
  parseWebhook(input: WebhookVerificationInput): Promise<WebhookNotification | null>;
}

export class PaymentGatewayError extends Error {
  constructor(
    message: string,
    readonly cause?: unknown,
  ) {
    super(message);
    this.name = "PaymentGatewayError";
  }
}

export class InvalidWebhookRequestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidWebhookRequestError";
  }
}
