import type { PaymentMethodType, PaymentStatus } from "./types";

export type OrderRecord = {
  externalReference: string;
  productSlug: string;
  amount: number;
  currency: string;
  payerEmail: string;
  method: PaymentMethodType;
  status: PaymentStatus;
  gatewayPaymentId?: string;
  createdAt: string;
  updatedAt: string;
};

/**
 * Persistência de pedidos, desacoplada do gateway de pagamento.
 *
 * A implementação padrão guarda os pedidos em memória, o que é suficiente
 * para uma única instância Node.js de longa duração. Em uma implantação
 * serverless com múltiplas instâncias, esta interface deve ser implementada
 * sobre um banco de dados real (ver `docs/MERCADO_PAGO.md`); nenhuma rota de
 * API precisa mudar, pois todas dependem apenas de `OrderStore`.
 */
export interface OrderStore {
  create(record: OrderRecord): Promise<boolean>;
  updateStatusByGatewayPaymentId(
    gatewayPaymentId: string,
    status: PaymentStatus,
  ): Promise<OrderRecord | null>;
  attachGatewayPaymentId(externalReference: string, gatewayPaymentId: string, status: PaymentStatus): Promise<OrderRecord | null>;
  getByExternalReference(externalReference: string): Promise<OrderRecord | null>;
  getByGatewayPaymentId(gatewayPaymentId: string): Promise<OrderRecord | null>;
}

class InMemoryOrderStore implements OrderStore {
  private readonly ordersByReference = new Map<string, OrderRecord>();
  private readonly referenceByGatewayId = new Map<string, string>();

  async create(record: OrderRecord): Promise<boolean> {
    if (this.ordersByReference.has(record.externalReference)) return false;
    this.ordersByReference.set(record.externalReference, record);
    if (record.gatewayPaymentId) this.referenceByGatewayId.set(record.gatewayPaymentId, record.externalReference);
    return true;
  }

  async attachGatewayPaymentId(externalReference: string, gatewayPaymentId: string, status: PaymentStatus): Promise<OrderRecord | null> {
    const order = this.ordersByReference.get(externalReference);
    if (!order || (order.gatewayPaymentId && order.gatewayPaymentId !== gatewayPaymentId)) return null;
    const mappedReference = this.referenceByGatewayId.get(gatewayPaymentId);
    if (mappedReference && mappedReference !== externalReference) return null;
    order.gatewayPaymentId = gatewayPaymentId;
    if (canTransition(order.status, status)) order.status = status;
    order.updatedAt = new Date().toISOString();
    this.referenceByGatewayId.set(gatewayPaymentId, externalReference);
    return order;
  }

  async updateStatusByGatewayPaymentId(gatewayPaymentId: string, status: PaymentStatus): Promise<OrderRecord | null> {
    const externalReference = this.referenceByGatewayId.get(gatewayPaymentId);
    if (!externalReference) return null;
    const order = this.ordersByReference.get(externalReference);
    if (!order) return null;
    if (canTransition(order.status, status) && order.status !== status) {
      order.status = status;
      order.updatedAt = new Date().toISOString();
    }
    return order;
  }

  async getByExternalReference(externalReference: string): Promise<OrderRecord | null> {
    return this.ordersByReference.get(externalReference) ?? null;
  }

  async getByGatewayPaymentId(gatewayPaymentId: string): Promise<OrderRecord | null> {
    const externalReference = this.referenceByGatewayId.get(gatewayPaymentId);
    return externalReference ? (this.ordersByReference.get(externalReference) ?? null) : null;
  }
}

function canTransition(current: PaymentStatus, next: PaymentStatus): boolean {
  if (current === next) return true;
  if (current === "approved") return next === "refunded" || next === "charged_back";
  if (current === "rejected" || current === "cancelled" || current === "refunded" || current === "charged_back") return false;
  return true;
}

const globalForOrderStore = globalThis as unknown as { __escalaHubOrderStore?: OrderStore };

export function getOrderStore(): OrderStore {
  if (!globalForOrderStore.__escalaHubOrderStore) {
    globalForOrderStore.__escalaHubOrderStore = new InMemoryOrderStore();
  }
  return globalForOrderStore.__escalaHubOrderStore;
}
