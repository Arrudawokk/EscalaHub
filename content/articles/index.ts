import { comoComecarNoTrafegoPago } from "./como-comecar-no-trafego-pago";
import { metricasDeTrafegoPago } from "./metricas-de-trafego-pago";
import type { Article } from "./types";

const articles = [comoComecarNoTrafegoPago, metricasDeTrafegoPago] satisfies readonly Article[];

export * from "./authors";
export * from "./types";

export function getPublishedArticles(): Article[] {
  return articles
    .filter((article) => article.status === "published")
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function getFeaturedArticles(): Article[] {
  return getPublishedArticles().filter((article) => article.featured);
}

export function getArticleBySlug(slug: string): Article | undefined {
  return getPublishedArticles().find((article) => article.slug === slug);
}

export function getArticlePath(article: Pick<Article, "slug">): string {
  return `/blog/${article.slug}`;
}

export function getArticleReadingTime(article: Article): number {
  const words = article.sections.flatMap((section) => [section.title, ...section.paragraphs, ...(section.bullets ?? []), section.callout ?? ""]).join(" ").trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

export function formatArticleDate(value: string): string {
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${value}T00:00:00Z`));
}
