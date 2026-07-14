import "server-only";
import type { ProductDelivery } from "@/lib/catalog";

export type PrivateAsset = {
  url: URL;
  authorization?: string;
  fileName: string;
  contentType: ProductDelivery["contentType"];
};

export interface PrivateAssetStore {
  resolve(delivery: ProductDelivery): PrivateAsset | null;
}

class EnvironmentHttpAssetStore implements PrivateAssetStore {
  resolve(delivery: ProductDelivery): PrivateAsset | null {
    const configuredUrl = process.env[delivery.sourceUrlEnvironmentVariable]?.trim();
    if (!configuredUrl) return null;
    try {
      const url = new URL(configuredUrl);
      const localDevelopment = process.env.NODE_ENV === "development" && ["localhost", "127.0.0.1"].includes(url.hostname);
      if (url.protocol !== "https:" && !localDevelopment) return null;
      const authorizationVariable = delivery.sourceAuthorizationEnvironmentVariable;
      const authorization = authorizationVariable ? process.env[authorizationVariable]?.trim() : undefined;
      return { url, authorization: authorization || undefined, fileName: delivery.fileName, contentType: delivery.contentType };
    } catch {
      return null;
    }
  }
}

const privateAssetStore: PrivateAssetStore = new EnvironmentHttpAssetStore();

export function getPrivateAssetStore(): PrivateAssetStore {
  return privateAssetStore;
}

function safeFileName(fileName: string): string {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, "-");
}

export async function streamPrivateAsset(asset: PrivateAsset): Promise<Response | null> {
  const upstream = await fetch(asset.url, {
    cache: "no-store",
    headers: asset.authorization ? { Authorization: asset.authorization } : undefined,
    redirect: "error",
    signal: AbortSignal.timeout(12_000),
  });
  if (!upstream.ok || !upstream.body) return null;
  const headers = new Headers({
    "Cache-Control": "private, no-store, max-age=0",
    "X-Content-Type-Options": "nosniff",
    "Content-Type": asset.contentType,
    "Content-Disposition": `attachment; filename="${safeFileName(asset.fileName)}"; filename*=UTF-8''${encodeURIComponent(asset.fileName)}`,
    "Content-Security-Policy": "sandbox",
  });
  const contentLength = upstream.headers.get("content-length");
  if (contentLength && /^\d+$/.test(contentLength)) headers.set("Content-Length", contentLength);
  return new Response(upstream.body, { status: 200, headers });
}
