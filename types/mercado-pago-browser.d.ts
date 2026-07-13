export {};

type CardTokenPayload = {
  cardNumber: string;
  cardholderName: string;
  cardExpirationMonth: string;
  cardExpirationYear: string;
  securityCode: string;
  identificationType: string;
  identificationNumber: string;
};

type PaymentMethodLookupResult = {
  results: Array<{ id: string; payment_type_id: string }>;
};

interface MercadoPagoBrowserInstance {
  cardToken: {
    create: (payload: CardTokenPayload) => Promise<{ id: string }>;
  };
  getPaymentMethods: (data: { bin: string }) => Promise<PaymentMethodLookupResult>;
}

declare global {
  interface Window {
    MercadoPago?: new (publicKey: string, options?: { locale?: string }) => MercadoPagoBrowserInstance;
  }
}
