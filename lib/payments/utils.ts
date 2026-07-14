import type { PaymentStatus } from "./types";

export function onlyDigits(value: string): string {
  return value.replace(/\D/g, "");
}

/**
 * Valida um CPF utilizando o algoritmo oficial de dígitos verificadores.
 * Aceita o valor já formatado (com pontos e traço) ou apenas dígitos.
 */
export function isValidCpf(value: string): boolean {
  const cpf = onlyDigits(value);
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

  const digits = cpf.split("").map(Number);
  const calculateVerifier = (length: number) => {
    const sum = digits.slice(0, length).reduce((total, digit, index) => total + digit * (length + 1 - index), 0);
    const remainder = (sum * 10) % 11;
    return remainder === 10 ? 0 : remainder;
  };

  return calculateVerifier(9) === digits[9] && calculateVerifier(10) === digits[10];
}

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

/**
 * Divide um nome completo em nome e sobrenome, como exigido pelo Mercado Pago.
 */
export function splitFullName(fullName: string): { firstName: string; lastName: string } {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { firstName: "", lastName: "" };
  if (parts.length === 1) return { firstName: parts[0], lastName: parts[0] };
  return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
}

/**
 * Chave de idempotência determinística por pedido, para evitar cobranças
 * duplicadas em caso de reenvio da requisição de criação de pagamento.
 */
export function buildIdempotencyKey(externalReference: string): string {
  return `escalahub-${externalReference}`;
}

const statusMap: Record<string, PaymentStatus> = {
  pending: "pending",
  in_process: "in_process",
  in_mediation: "in_process",
  approved: "approved",
  // Uma autorização ainda não representa captura/credito confirmado.
  authorized: "in_process",
  rejected: "rejected",
  cancelled: "cancelled",
  refunded: "refunded",
  charged_back: "charged_back",
};

/**
 * Normaliza o status retornado pelo Mercado Pago para o vocabulário interno
 * da aplicação, para que o restante do código nunca dependa de strings
 * específicas de um gateway.
 */
export function mapMercadoPagoStatus(status: string | undefined): PaymentStatus {
  return (status && statusMap[status]) || "pending";
}
