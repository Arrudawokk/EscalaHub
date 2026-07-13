import type { Metadata } from "next";
import { FiBookOpen, FiCheckCircle, FiCompass, FiEye, FiHeart, FiLayers, FiShield, FiTarget, FiUsers } from "react-icons/fi";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Badge } from "@/components/ui/Badge";
import { getDefaultProduct, getProductPath } from "@/lib/catalog";
import { SITE_URL, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Sobre a EscalaHub",
  description: "Conheça a missão, os valores e os princípios editoriais e de produto que orientam a EscalaHub.",
  alternates: { canonical: "/sobre" },
  openGraph: { title: "Sobre a EscalaHub", description: "Produtos digitais práticos, informação clara e crescimento com método.", url: "/sobre", type: "website", siteName: siteConfig.name, locale: siteConfig.locale, images: ["/opengraph-image"] },
  twitter: { card: "summary_large_image", title: "Sobre a EscalaHub", description: "Conheça os princípios que orientam a plataforma.", images: ["/twitter-image"] },
};

const values = [
  { icon: FiCheckCircle, title: "Clareza antes de complexidade", text: "Conteúdo direto, organizado e sem jargão desnecessário." },
  { icon: FiShield, title: "Responsabilidade", text: "Sem números inventados, escassez artificial ou promessas que o produto não pode sustentar." },
  { icon: FiLayers, title: "Aplicação", text: "Cada material deve ajudar o leitor a transformar conceito em uma próxima decisão." },
  { icon: FiHeart, title: "Respeito pelo usuário", text: "Preço, formato, acesso e garantia apresentados com transparência." },
];

export default function AboutPage() {
  const productHref = getProductPath(getDefaultProduct());
  const aboutSchema = { "@context": "https://schema.org", "@type": "AboutPage", "@id": `${SITE_URL}/sobre#about`, name: "Sobre a EscalaHub", url: `${SITE_URL}/sobre`, description: metadata.description, isPartOf: { "@id": `${SITE_URL}/#website` }, about: { "@id": `${SITE_URL}/#organization` } };

  return (
    <>
      <Header productHref={productHref} />
      <main>
        <section className="noise relative overflow-hidden border-b border-white/[.06] pb-20 pt-[132px] sm:pt-[148px]">
          <div className="premium-grid pointer-events-none absolute inset-0 opacity-55" /><div className="pointer-events-none absolute right-[-12rem] top-[-16rem] h-[42rem] w-[42rem] rounded-full bg-blue-600/[.12] blur-[160px]" />
          <div className="container-default relative grid gap-12 lg:grid-cols-[1.1fr_.9fr] lg:items-end"><div><Badge variant="success">Sobre a EscalaHub</Badge><h1 className="display-title mt-6 text-[clamp(3.5rem,8vw,7rem)] font-semibold leading-[.9] text-white">Conhecimento claro.<br /><span className="gradient-text">Crescimento com método.</span></h1></div><p className="max-w-xl text-lg leading-8 text-zinc-300 lg:justify-self-end">A EscalaHub organiza conhecimento prático para pessoas que querem aprender, tomar decisões melhores e avançar sem depender de atalhos.</p></div>
        </section>

        <section className="section"><div className="container-default grid gap-5 md:grid-cols-2"><article className="card rounded-[28px] p-8 sm:p-10"><FiTarget className="text-3xl text-[#b8ff5c]" aria-hidden="true" /><span className="eyebrow mt-7">Missão</span><h2 className="display-title mt-4 text-4xl font-semibold text-white">Tornar conhecimento aplicável.</h2><p className="mt-5 leading-8 text-zinc-400">Criar produtos digitais e conteúdos que reduzam confusão, organizem prioridades e ajudem o usuário a agir com mais segurança.</p></article><article className="card rounded-[28px] p-8 sm:p-10"><FiEye className="text-3xl text-blue-400" aria-hidden="true" /><span className="eyebrow mt-7">Visão</span><h2 className="display-title mt-4 text-4xl font-semibold text-white">Ser referência em clareza.</h2><p className="mt-5 leading-8 text-zinc-400">Construir uma plataforma reconhecida pela qualidade editorial, transparência comercial e utilidade real de cada material publicado.</p></article></div></section>

        <section className="section border-y border-white/[.06] bg-[#090c12]"><div className="container-default"><div className="max-w-3xl"><span className="eyebrow">Nossos valores</span><h2 className="display-title mt-5 text-4xl font-semibold text-white sm:text-6xl">Confiança se constrói nos detalhes.</h2></div><div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">{values.map(({ icon: Icon, title, text }) => <article key={title} className="card rounded-[24px] p-7"><Icon className="text-2xl text-[#b8ff5c]" aria-hidden="true" /><h3 className="mt-6 text-lg font-bold text-white">{title}</h3><p className="mt-3 text-sm leading-7 text-zinc-400">{text}</p></article>)}</div></div></section>

        <section className="section"><div className="container-default grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:items-start"><div><span className="eyebrow">Como surgiu</span><h2 className="display-title mt-5 text-4xl font-semibold text-white sm:text-6xl">Da informação dispersa para um caminho claro.</h2></div><div className="space-y-5 text-lg leading-9 text-zinc-300"><p>A EscalaHub nasceu da percepção de que excesso de informação não significa clareza. Em marketing, negócios e tecnologia, conteúdos fragmentados frequentemente deixam o usuário sem saber o que fazer primeiro.</p><p>A plataforma foi estruturada para reunir produtos digitais objetivos, conteúdo editorial responsável e uma experiência de compra transparente. O foco não é prometer resultado automático, mas oferecer método, contexto e material de consulta.</p></div></div></section>

        <section className="section border-y border-white/[.06] bg-[#090c12]"><div className="container-default"><div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr]"><div><span className="eyebrow">Por que confiar</span><h2 className="display-title mt-5 text-4xl font-semibold text-white sm:text-6xl">Critérios visíveis, não selos inventados.</h2></div><div className="grid gap-4 sm:grid-cols-2">{[{ icon: FiBookOpen, title: "Conteúdo estruturado", text: "Objetivo, público, formato e aprendizado apresentados antes da compra." },{ icon: FiCompass, title: "Decisão informada", text: "Preço, acesso e garantia explicados de forma direta." },{ icon: FiShield, title: "Comunicação responsável", text: "Sem avaliações, clientes ou certificações fictícias." },{ icon: FiCheckCircle, title: "Atualização editorial", text: "Artigos identificam publicação e última revisão." }].map(({ icon: Icon, title, text }) => <article key={title} className="rounded-[22px] border border-white/[.08] bg-white/[.025] p-6"><Icon className="text-2xl text-[#b8ff5c]" aria-hidden="true" /><h3 className="mt-5 font-bold text-white">{title}</h3><p className="mt-2 text-sm leading-6 text-zinc-400">{text}</p></article>)}</div></div></div></section>

        <section className="section"><div className="container-default"><div className="max-w-3xl"><span className="eyebrow">Equipe e responsabilidades</span><h2 className="display-title mt-5 text-4xl font-semibold text-white sm:text-6xl">Uma estrutura preparada para crescer.</h2><p className="mt-6 text-lg leading-8 text-zinc-300">Perfis individuais só serão publicados com identificação e autorização. Hoje, a operação é apresentada pelas responsabilidades que sustentam a plataforma.</p></div><div className="mt-12 grid gap-4 md:grid-cols-3">{[{ title: "Curadoria editorial", text: "Define pauta, revisa clareza e mantém consistência dos materiais." },{ title: "Produto e experiência", text: "Organiza a jornada, acessibilidade e comunicação de cada produto." },{ title: "Tecnologia e operação", text: "Mantém a plataforma, performance, segurança e integrações." }].map(({ title, text }) => <article key={title} className="card rounded-[24px] p-7"><FiUsers className="text-2xl text-[#b8ff5c]" aria-hidden="true" /><h3 className="mt-6 text-xl font-bold text-white">{title}</h3><p className="mt-3 leading-7 text-zinc-400">{text}</p></article>)}</div></div></section>
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema).replace(/</g, "\\u003c") }} />
    </>
  );
}
