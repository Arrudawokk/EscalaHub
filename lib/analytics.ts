type EventParameters = Record<string, unknown>;
type PurchaseParameters = { transactionId: string; value: number; currency?: string };

export type AnalyticsProduct = {
  slug: string;
  title: string;
  price: number;
  currency: string;
};

declare global {
  interface Window {
    dataLayer?: unknown[];
    fbq?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
  }
}

function validEnvironmentValue(value: string | undefined, pattern: RegExp): string | undefined {
  const normalized = value?.trim();
  return normalized && pattern.test(normalized) ? normalized : undefined;
}

export const analyticsConfig = {
  googleAnalyticsId: validEnvironmentValue(process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID, /^G-[A-Z0-9]+$/i),
  googleTagManagerId: validEnvironmentValue(process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID, /^GTM-[A-Z0-9]+$/i),
  metaPixelId: validEnvironmentValue(process.env.NEXT_PUBLIC_META_PIXEL_ID, /^\d{5,20}$/),
} as const;

const { googleAnalyticsId, googleTagManagerId, metaPixelId } = analyticsConfig;
const trackedPurchases = new Set<string>();

function getProductParameters(product: AnalyticsProduct) {
  return {
    content_ids: [product.slug],
    content_name: product.title,
    content_type: "product",
    currency: product.currency,
    value: product.price,
  };
}

function getGoogleItem(product: AnalyticsProduct) {
  return { item_id: product.slug, item_name: product.title, price: product.price, quantity: 1 };
}

function pushDataLayer(event: Record<string, unknown>) {
  if (!googleTagManagerId || typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(event);
}

function sendGoogleEvent(name: string, parameters: EventParameters) {
  if (!googleAnalyticsId || typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || ((...args: unknown[]) => window.dataLayer?.push(args));
  window.gtag("event", name, parameters);
}

function sendMetaEvent(name: "PageView" | "ViewContent" | "InitiateCheckout" | "Purchase", parameters?: EventParameters, eventId?: string) {
  if (!metaPixelId || typeof window === "undefined" || !window.fbq) return;
  if (eventId) window.fbq("track", name, parameters, { eventID: eventId });
  else window.fbq("track", name, parameters);
}

export function trackPageView(pathname: string) {
  if (googleAnalyticsId && typeof window !== "undefined") {
    window.gtag?.("config", googleAnalyticsId, { page_path: pathname });
  }
  sendMetaEvent("PageView");
  pushDataLayer({ event: "virtual_page_view", page_path: pathname });
}

export function trackViewContent(product: AnalyticsProduct) {
  const parameters = getProductParameters(product);
  sendGoogleEvent("view_item", { currency: product.currency, value: product.price, items: [getGoogleItem(product)] });
  sendMetaEvent("ViewContent", parameters);
  pushDataLayer({ event: "view_content", ...parameters });
}

export function trackInitiateCheckout(product: AnalyticsProduct) {
  const parameters = getProductParameters(product);
  sendGoogleEvent("begin_checkout", { currency: product.currency, value: product.price, items: [getGoogleItem(product)] });
  sendMetaEvent("InitiateCheckout", parameters);
  pushDataLayer({ event: "initiate_checkout", ...parameters });
}

export function trackPurchase(product: AnalyticsProduct, { transactionId, value, currency = product.currency }: PurchaseParameters) {
  if (typeof window === "undefined") return;
  if (trackedPurchases.has(transactionId)) return;
  const storageKey = `escalahub:purchase:${transactionId}`;
  try {
    if (window.localStorage.getItem(storageKey)) return;
    window.localStorage.setItem(storageKey, "1");
  } catch {
    // O Set em memória ainda evita duplicidade durante a sessão atual.
  }
  trackedPurchases.add(transactionId);
  const metaParameters = { ...getProductParameters(product), currency, value };
  const googleParameters = { currency, items: [{ ...getGoogleItem(product), price: value }], transaction_id: transactionId, value };
  sendGoogleEvent("purchase", googleParameters);
  sendMetaEvent("Purchase", metaParameters, transactionId);
  pushDataLayer({ event: "purchase", event_id: transactionId, ...googleParameters });
}

export function trackRouteChange(pathname: string) {
  trackPageView(pathname);
}
