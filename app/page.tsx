import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/marketing/Hero";
import { FeaturedProducts } from "@/components/marketing/FeaturedProducts";
import { Categories } from "@/components/marketing/Categories";
import { CTA } from "@/components/marketing/CTA";
import { FAQ } from "@/components/marketing/FAQ";
import { Footer } from "@/components/layout/Footer";
import { SITE_URL, siteConfig } from "@/lib/site";
import { getDefaultProduct, getFeaturedProducts, getProductPath } from "@/lib/catalog";

export default function Home() {
  const featuredProducts = getFeaturedProducts();
  const primaryProduct = featuredProducts[0] ?? getDefaultProduct();
  const productHref = getProductPath(primaryProduct);
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: siteConfig.name,
    url: SITE_URL,
    description: siteConfig.description,
    inLanguage: siteConfig.language,
    publisher: { "@id": `${SITE_URL}/#organization` },
  };

  return (
    <>
      <Header productHref={productHref} />
      <main>
        <Hero product={primaryProduct} />
        <FeaturedProducts products={featuredProducts} />
        <Categories product={primaryProduct} />
        <CTA product={primaryProduct} />
        <FAQ product={primaryProduct} />
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema).replace(/</g, "\\u003c") }} />
    </>
  );
}
