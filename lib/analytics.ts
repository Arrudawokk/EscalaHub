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

const googleAnalyticsId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;
const googleTagManagerId = process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID;
const metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;

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

function sendMetaEvent(name: "PageView" | "ViewContent" | "InitiateCheckout" | "Purchase", parameters?: EventParameters) {
  if (!metaPixelId || typeof window === "undefined" || !window.fbq) return;
  window.fbq("track", name, parameters);
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
  const metaParameters = { ...getProductParameters(product), currency, value };
  const googleParameters = { currency, items: [{ ...getGoogleItem(product), price: value }], transaction_id: transactionId, value };
  sendGoogleEvent("purchase", googleParameters);
  sendMetaEvent("Purchase", metaParameters);
  pushDataLayer({ event: "purchase", ...googleParameters });
}

export function trackRouteChange(pathname: string) {
  trackPageView(pathname);
}
