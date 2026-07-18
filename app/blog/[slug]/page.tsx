import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleHeader } from "@/components/content/ArticleHeader";
import { ArticleLayout } from "@/components/content/ArticleLayout";
import { getArticleAuthor, getArticleBySlug, getArticlePath, getArticleReadingTime, getPublishedArticles } from "@/content/articles";
import { SITE_URL, siteConfig } from "@/lib/site";

type ArticlePageProps = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getPublishedArticles().map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const article = getArticleBySlug((await params).slug);
  if (!article) return {};
  const path = getArticlePath(article);

  return {
    title: article.title,
    description: article.description,
    keywords: article.keywords,
    authors: [{ name: getArticleAuthor(article.authorId)?.name ?? siteConfig.name }],
    alternates: { canonical: path },
    openGraph: {
      title: article.title,
      description: article.description,
      type: "article",
      url: path,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      authors: [siteConfig.name],
      images: [{ url: "/brand/logo.png", width: 1536, height: 1024, alt: "Logo oficial da EscalaHub" }],
    },
    twitter: { card: "summary_large_image", title: article.title, description: article.description, images: ["/brand/logo.png"] },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const article = getArticleBySlug((await params).slug);
  if (!article) notFound();
  const author = getArticleAuthor(article.authorId);
  if (!author) throw new Error(`Autor não encontrado para o artigo: ${article.slug}`);

  const path = getArticlePath(article);
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${SITE_URL}${path}#article`,
    headline: article.title,
    description: article.description,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    inLanguage: siteConfig.language,
    mainEntityOfPage: `${SITE_URL}${path}`,
    wordCount: article.sections.flatMap((section) => section.paragraphs).join(" ").split(/\s+/).length,
    timeRequired: `PT${getArticleReadingTime(article)}M`,
    author: { "@type": "Organization", name: author.name, url: SITE_URL },
    publisher: { "@id": `${SITE_URL}/#organization` },
    image: `${SITE_URL}/brand/logo.png`,
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Início", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
      { "@type": "ListItem", position: 3, name: article.title, item: `${SITE_URL}${path}` },
    ],
  };

  return (
    <>
      <ArticleHeader article={article} author={author} />
      <ArticleLayout article={article} author={author} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema).replace(/</g, "\\u003c") }} />
    </>
  );
}
