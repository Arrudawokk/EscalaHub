function normalizeSiteUrl(value: string | undefined): string | null {
  const normalized = value?.trim();
  if (!normalized) return null;

  try {
    const url = new URL(normalized);
    const isLocalDevelopment = process.env.NODE_ENV === "development" && ["localhost", "127.0.0.1"].includes(url.hostname);
    if (url.protocol !== "https:" && !(isLocalDevelopment && url.protocol === "http:")) return null;
    return url.origin;
  } catch {
    return null;
  }
}

const configuredSiteUrl = normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);
const vercelProductionHost = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
const vercelProductionUrl = normalizeSiteUrl(
  vercelProductionHost ? `https://${vercelProductionHost}` : undefined,
);

export const hasDeploymentSiteUrl = Boolean(configuredSiteUrl || vercelProductionUrl);
export const SITE_URL = configuredSiteUrl || vercelProductionUrl || "https://escalahub.com";

export const siteConfig = {
  name: "EscalaHub",
  title: "EscalaHub — Produtos digitais para crescer com método",
  description: "Produtos digitais premium e métodos práticos para transformar conhecimento em crescimento profissional.",
  locale: "pt_BR",
  language: "pt-BR",
  contactEmail: "contato@escalahub.com",
  social: {
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL?.trim(),
    linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL?.trim(),
    youtube: process.env.NEXT_PUBLIC_YOUTUBE_URL?.trim(),
  },
} as const;
