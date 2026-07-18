import type { Metadata } from "next";
import { FiClock, FiHelpCircle, FiInstagram, FiLinkedin, FiMail, FiMessageCircle, FiYoutube } from "react-icons/fi";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { getDefaultProduct, getProductPath } from "@/lib/catalog";
import { SITE_URL, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contato e suporte",
  description: "Entre em contato com a EscalaHub para dúvidas sobre produtos, acesso, garantia, privacidade ou parcerias.",
  alternates: { canonical: "/contato" },
  openGraph: { title: "Contato EscalaHub", description: "Canais oficiais para dúvidas e suporte.", url: "/contato", type: "website", siteName: siteConfig.name, locale: siteConfig.locale, images: ["/brand/logo.png"] },
  twitter: { card: "summary_large_image", title: "Contato EscalaHub", description: "Fale com a EscalaHub pelos canais oficiais.", images: ["/brand/logo.png"] },
};

const socialLinks = [
  { label: "Instagram", href: siteConfig.social.instagram, icon: FiInstagram },
  { label: "LinkedIn", href: siteConfig.social.linkedin, icon: FiLinkedin },
  { label: "YouTube", href: siteConfig.social.youtube, icon: FiYoutube },
].filter((link): link is { label: string; href: string; icon: typeof FiInstagram } => Boolean(link.href));

export default function ContactPage() {
  const contactSchema = { "@context": "https://schema.org", "@type": "ContactPage", "@id": `${SITE_URL}/contato#contact`, name: "Contato EscalaHub", url: `${SITE_URL}/contato`, description: metadata.description, mainEntity: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, email: siteConfig.contactEmail } };
  return (
    <>
      <Header productHref={getProductPath(getDefaultProduct())} />
      <main>
        <section className="noise relative overflow-hidden border-b border-white/[.06] pb-16 pt-[132px] sm:pb-20 sm:pt-[148px]"><div className="premium-grid pointer-events-none absolute inset-0 opacity-55" /><div className="container-default relative"><span className="eyebrow">Contato oficial</span><h1 className="display-title mt-5 max-w-4xl text-[clamp(3.4rem,8vw,7rem)] font-semibold leading-[.92] text-white">Converse com a EscalaHub.</h1><p className="mt-7 max-w-2xl text-lg leading-8 text-zinc-300">Dúvidas sobre produtos, acesso, garantia, privacidade ou parcerias são respondidas pelos canais abaixo.</p></div></section>
        <section className="section"><div className="container-default grid gap-8 lg:grid-cols-[.72fr_1.28fr] lg:gap-14"><aside className="space-y-4"><div className="card rounded-[24px] p-6"><FiMail className="text-2xl text-[#b8ff5c]" aria-hidden="true" /><h2 className="mt-5 text-lg font-bold text-white">E-mail</h2><a href={`mailto:${siteConfig.contactEmail}`} className="mt-2 block break-all text-sm font-semibold text-zinc-300 hover:text-white">{siteConfig.contactEmail}</a></div><div className="card rounded-[24px] p-6"><FiClock className="text-2xl text-blue-400" aria-hidden="true" /><h2 className="mt-5 text-lg font-bold text-white">Prazo de resposta</h2><p className="mt-2 text-sm leading-6 text-zinc-400">As mensagens são organizadas por ordem de recebimento. O prazo pode variar conforme o volume de solicitações.</p></div>{socialLinks.length > 0 ? <div className="rounded-[24px] border border-white/[.08] bg-white/[.025] p-6"><h2 className="font-bold text-white">Canais sociais oficiais</h2><div className="mt-4 flex flex-wrap gap-2">{socialLinks.map(({ label, href, icon: Icon }) => <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/[.1] px-4 text-sm font-semibold text-zinc-300 hover:bg-white/[.05] hover:text-white"><Icon aria-hidden="true" /> {label}</a>)}</div></div> : null}</aside><div className="rounded-[30px] border border-white/[.09] bg-[#0d1119] p-6 shadow-[0_28px_90px_rgba(0,0,0,.22)] sm:p-8 lg:p-10"><p className="eyebrow">Envie sua mensagem</p><h2 className="display-title mt-4 text-3xl font-semibold text-white sm:text-4xl">Como podemos ajudar?</h2><form action={`mailto:${siteConfig.contactEmail}`} method="post" encType="text/plain" className="mt-8 grid gap-5 sm:grid-cols-2"><label><span className="mb-2 block text-xs font-bold text-zinc-300">Nome</span><Input required name="nome" autoComplete="name" placeholder="Seu nome" /></label><label><span className="mb-2 block text-xs font-bold text-zinc-300">E-mail</span><Input required name="email" type="email" autoComplete="email" placeholder="voce@email.com" /></label><label className="sm:col-span-2"><span className="mb-2 block text-xs font-bold text-zinc-300">Assunto</span><Input required name="assunto" placeholder="Produto, acesso, privacidade ou parceria" /></label><label className="sm:col-span-2"><span className="mb-2 block text-xs font-bold text-zinc-300">Mensagem</span><textarea required name="mensagem" rows={6} className="input-control h-auto min-h-40 resize-y py-3" placeholder="Explique como podemos ajudar." /></label><div className="sm:col-span-2"><Button type="submit" size="lg" className="w-full sm:w-auto"><FiMessageCircle aria-hidden="true" /> Abrir mensagem no e-mail</Button><p className="mt-3 text-xs leading-5 text-zinc-500">Ao enviar, seu aplicativo de e-mail será aberto com os dados preenchidos.</p></div></form></div></div></section>
        <section className="section border-t border-white/[.06] bg-[#090c12]"><div className="container-default"><div className="max-w-3xl"><span className="eyebrow">FAQ rápido</span><h2 className="display-title mt-5 text-4xl font-semibold text-white sm:text-5xl">Antes de enviar.</h2></div><div className="mt-10 grid gap-4 md:grid-cols-3">{[{ title: "Não recebi o acesso", text: "Verifique spam e promoções. Se o pagamento foi confirmado, informe no contato o mesmo e-mail usado na compra." },{ title: "Quero solicitar garantia", text: "Informe produto, e-mail da compra e data aproximada para que a solicitação possa ser localizada." },{ title: "Tenho uma dúvida de privacidade", text: "Use o assunto LGPD ou Privacidade para facilitar o direcionamento da mensagem." }].map(({ title, text }) => <article key={title} className="card rounded-[22px] p-6"><FiHelpCircle className="text-xl text-[#b8ff5c]" aria-hidden="true" /><h3 className="mt-5 font-bold text-white">{title}</h3><p className="mt-2 text-sm leading-6 text-zinc-400">{text}</p></article>)}</div></div></section>
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema).replace(/</g, "\\u003c") }} />
    </>
  );
}
