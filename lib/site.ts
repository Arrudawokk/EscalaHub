const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

export const SITE_URL = (configuredSiteUrl || "https://escalahub.com").replace(/\/$/, "");

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
