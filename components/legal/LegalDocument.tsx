import { FiAlertCircle, FiCalendar, FiMail } from "react-icons/fi";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { getDefaultProduct, getProductPath } from "@/lib/catalog";
import { siteConfig } from "@/lib/site";

export type LegalSection = { title: string; paragraphs: string[]; bullets?: string[] };

export function LegalDocument({ eyebrow, title, description, sections, updatedAt = "12 de julho de 2026" }: { eyebrow: string; title: string; description: string; sections: LegalSection[]; updatedAt?: string }) {
  return (
    <>
      <Header productHref={getProductPath(getDefaultProduct())} />
      <main>
        <header className="noise relative overflow-hidden border-b border-white/[.06] pb-14 pt-[128px] sm:pb-18 sm:pt-[144px]">
          <div className="premium-grid pointer-events-none absolute inset-0 opacity-45" />
          <div className="container-default relative max-w-5xl">
            <span className="eyebrow">{eyebrow}</span>
            <h1 className="display-title mt-5 text-[clamp(3rem,7vw,5.7rem)] font-semibold leading-[.95] text-white">{title}</h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-300">{description}</p>
            <p className="mt-6 flex items-center gap-2 text-xs font-semibold text-zinc-500"><FiCalendar aria-hidden="true" /> Última atualização: {updatedAt}</p>
          </div>
        </header>
        <div className="container-default grid max-w-5xl gap-10 py-14 lg:grid-cols-[220px_minmax(0,1fr)] lg:py-20">
          <aside className="lg:sticky lg:top-24 lg:h-fit">
            <nav aria-label="Sumário" className="rounded-[20px] border border-white/[.08] bg-white/[.025] p-4">
              <p className="px-2 text-[10px] font-black uppercase tracking-[.14em] text-[#b8ff5c]">Nesta página</p>
              <ul className="mt-3 space-y-1">{sections.map((section, index) => <li key={section.title}><a href={`#secao-${index + 1}`} className="block rounded-lg px-2 py-2 text-sm leading-5 text-zinc-400 outline-none transition-colors hover:bg-white/[.04] hover:text-white focus-visible:ring-2 focus-visible:ring-[#3B82F6]">{section.title}</a></li>)}</ul>
            </nav>
          </aside>
          <article className="min-w-0 space-y-12">
            <div className="flex gap-3 rounded-[20px] border border-amber-400/15 bg-amber-400/[.055] p-5 text-sm leading-6 text-amber-100/85"><FiAlertCircle className="mt-1 shrink-0" aria-hidden="true" /><p>Este documento organiza as práticas atuais da plataforma e está preparado para revisão jurídica especializada conforme a operação evoluir.</p></div>
            {sections.map((section, index) => (
              <section key={section.title} id={`secao-${index + 1}`}>
                <h2 className="display-title text-3xl font-semibold text-white sm:text-4xl">{section.title}</h2>
                <div className="mt-5 space-y-4 text-base leading-8 text-zinc-300">{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
                {section.bullets ? <ul className="mt-5 list-disc space-y-3 pl-6 leading-7 text-zinc-300 marker:text-[#b8ff5c]">{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul> : null}
              </section>
            ))}
            <div className="rounded-[22px] border border-white/[.09] bg-white/[.03] p-6"><h2 className="text-lg font-bold text-white">Dúvidas sobre este documento?</h2><p className="mt-2 leading-7 text-zinc-400">Entre em contato para solicitar esclarecimentos ou exercer seus direitos.</p><a href={`mailto:${siteConfig.contactEmail}`} className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-lg py-2 text-sm font-bold text-[#b8ff5c] outline-none hover:text-[#d9ffab] focus-visible:ring-2 focus-visible:ring-[#3B82F6]"><FiMail aria-hidden="true" /> {siteConfig.contactEmail}</a></div>
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}
