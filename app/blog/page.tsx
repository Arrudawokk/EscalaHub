import type { Metadata } from "next";
import { ArticleCard } from "@/components/content/ArticleCard";
import { getFeaturedArticles, getPublishedArticles } from "@/content/articles";
import { SITE_URL, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Blog — Marketing, negócios e tecnologia",
  description: "Conteúdo prático da EscalaHub para tomar decisões melhores em marketing, negócios, produtividade, IA e tecnologia.",
  keywords: ["blog de marketing", "produtos digitais", "tráfego pago", "negócios", "produtividade", "EscalaHub"],
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Blog EscalaHub — Conhecimento para aplicar",
    description: "Guias práticos e análises responsáveis sobre marketing, negócios e tecnologia.",
    type: "website",
    url: "/blog",
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Blog EscalaHub" }],
  },
  twitter: { card: "summary_large_image", title: "Blog EscalaHub", description: "Conhecimento prático para aplicar com método.", images: ["/twitter-image"] },
};

export default function BlogPage() {
  const articles = getPublishedArticles();
  const featured = getFeaturedArticles()[0] ?? articles[0];
  const remaining = articles.filter((article) => article.slug !== featured?.slug);
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${SITE_URL}/blog#collection`,
    name: "Blog EscalaHub",
    description: metadata.description,
    url: `${SITE_URL}/blog`,
    isPartOf: { "@id": `${SITE_URL}/#website` },
    publisher: { "@id": `${SITE_URL}/#organization` },
    hasPart: articles.map((article) => ({ "@type": "Article", headline: article.title, url: `${SITE_URL}/blog/${article.slug}` })),
  };

  return (
    <>
      <section className="noise relative overflow-hidden border-b border-white/[.06] pb-16 pt-[132px] sm:pb-20 sm:pt-[148px]">
        <div className="premium-grid pointer-events-none absolute inset-0 opacity-60" />
        <div className="pointer-events-none absolute right-[-12rem] top-[-16rem] h-[40rem] w-[40rem] rounded-full bg-violet-600/[.11] blur-[160px]" />
        <div className="container-default relative">
          <span className="eyebrow">Conteúdo EscalaHub</span>
          <h1 className="display-title mt-6 max-w-4xl text-[clamp(3.4rem,8vw,7rem)] font-semibold leading-[.92] text-white">Conhecimento para decidir.<br /><span className="gradient-text">Método para aplicar.</span></h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-zinc-300 sm:text-xl sm:leading-9">Guias práticos, conceitos explicados com clareza e conteúdo atualizado sem promessas fáceis.</p>
        </div>
      </section>

      <section className="section" aria-labelledby="artigos-title">
        <div className="container-default">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><span className="eyebrow">Biblioteca</span><h2 id="artigos-title" className="display-title mt-4 text-4xl font-semibold text-white sm:text-5xl">Artigos para avançar com clareza.</h2></div><p className="max-w-md text-sm leading-6 text-zinc-400">Conteúdo baseado em princípios, revisado para permanecer útil além das tendências do momento.</p></div>
          {featured ? <div className="mt-12"><ArticleCard article={featured} featured /></div> : null}
          {remaining.length > 0 ? <div className="mt-5 grid gap-5 md:grid-cols-2">{remaining.map((article) => <ArticleCard key={article.slug} article={article} />)}</div> : null}
        </div>
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema).replace(/</g, "\\u003c") }} />
    </>
  );
}
