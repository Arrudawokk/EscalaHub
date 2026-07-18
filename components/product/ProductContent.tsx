import Link from "next/link";
import {
  FiArrowRight,
  FiBarChart2,
  FiBookOpen,
  FiBriefcase,
  FiCheck,
  FiCheckCircle,
  FiCrosshair,
  FiFileText,
  FiLayers,
  FiMessageSquare,
  FiMonitor,
  FiPlus,
  FiRefreshCw,
  FiShield,
  FiShoppingBag,
  FiTarget,
  FiTrendingUp,
  FiUser,
  FiUsers,
  FiZap,
} from "react-icons/fi";
import { Button } from "@/components/ui/Button";
import { formatProductPrice, type Product } from "@/lib/catalog";

const benefitIcons = [FiTarget, FiBarChart2, FiZap];
const learningIcons = [FiCrosshair, FiUsers, FiBarChart2, FiTrendingUp];
const audienceIcons = [FiBookOpen, FiMonitor, FiBriefcase, FiUser, FiShoppingBag];

export function ProductContent({ product }: { product: Product }) {
  const formattedPrice = formatProductPrice(product);
  return (
    <>
      <section className="section" aria-labelledby="beneficios-title">
        <div className="container-default">
          <div className="grid gap-7 md:grid-cols-[1fr_.8fr] md:items-end">
            <div>
              <span className="eyebrow">Benefícios do guia</span>
              <h2 id="beneficios-title" className="display-title mt-5 max-w-3xl text-4xl font-semibold leading-[1.02] text-white sm:text-5xl md:text-6xl">Menos improviso.<br />Mais clareza para agir.</h2>
            </div>
            <p className="max-w-lg text-base leading-7 text-zinc-300 sm:text-lg sm:leading-8 md:justify-self-end">Um material de consulta criado para transformar conceitos em decisões mais seguras no dia a dia.</p>
          </div>
          <div className="mt-12 grid gap-4 md:mt-16 md:grid-cols-3">
            {product.benefits.map(({ title, description }, index) => {
              const Icon = benefitIcons[index % benefitIcons.length];
              return (
              <article key={title} className="card interactive-card rounded-[26px] p-7 sm:p-8">
                <span className="grid h-12 w-12 place-items-center rounded-2xl border border-[#b8ff5c]/10 bg-[#b8ff5c]/[.08] text-xl text-[#b8ff5c]"><Icon aria-hidden="true" /></span>
                <h3 className="mt-7 text-xl font-bold tracking-[-.025em] text-white">{title}</h3>
                <p className="mt-3 leading-7 text-zinc-400">{description}</p>
              </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section border-y border-white/[.07] bg-[#090c12]" aria-labelledby="aprendizados-title">
        <div className="container-default">
          <div className="max-w-3xl">
            <span className="eyebrow">O que você vai aprender</span>
            <h2 id="aprendizados-title" className="display-title mt-5 text-4xl font-semibold leading-[1.02] text-white sm:text-5xl md:text-6xl">Um método para sair<br />do improviso.</h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300">Do planejamento à escala, cada etapa foi organizada para você aplicar enquanto aprende.</p>
          </div>
          <div className="mt-12 grid gap-4 md:mt-16 md:grid-cols-2">
            {product.learning.map(({ title, description }, index) => {
              const Icon = learningIcons[index % learningIcons.length];
              return (
              <article key={title} className="card interactive-card rounded-[26px] p-7 sm:p-9">
                <div className="flex items-start justify-between">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#b8ff5c]/10 text-xl text-[#b8ff5c]"><Icon aria-hidden="true" /></span>
                  <span className="text-xs font-bold tracking-[.12em] text-zinc-600">0{index + 1}</span>
                </div>
                <h3 className="mt-7 text-2xl font-bold tracking-[-.025em] text-white">{title}</h3>
                <p className="mt-3 max-w-lg leading-7 text-zinc-400">{description}</p>
              </article>
              );
            })}
          </div>
          <div className="mt-8 flex flex-col gap-5 rounded-[24px] border border-white/[.09] bg-white/[.035] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
            <div><strong className="text-lg text-white">Pronto para aprender com um processo claro?</strong><p className="mt-1 text-sm text-zinc-400">Acesso digital e garantia de {product.guaranteeDays} dias.</p></div>
            <Button asChild size="md" className="group sm:min-w-52"><Link href={product.checkoutUrl}>Quero começar <FiArrowRight className="transition-transform group-hover:translate-x-1" /></Link></Button>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="conteudo-title">
        <div className="container-default grid gap-12 lg:grid-cols-[.68fr_1.32fr] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:h-fit">
            <span className="eyebrow">Por dentro do material</span>
            <h2 id="conteudo-title" className="display-title mt-5 text-4xl font-semibold leading-[1.02] text-white sm:text-5xl md:text-6xl">Conteúdo em<br />{product.modules.length} módulos.</h2>
            <p className="mt-6 max-w-md leading-7 text-zinc-400">Uma sequência lógica e prática para construir conhecimento sem pular etapas importantes.</p>
            <div className="mt-7 inline-flex items-center gap-2 rounded-full border border-white/[.08] bg-white/[.03] px-4 py-2 text-xs font-semibold text-zinc-300"><FiFileText className="text-[#b8ff5c]" /> {product.format} para consulta</div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {product.modules.map(({ title, description, topics }, index) => (
              <article key={title} className="card interactive-card rounded-[24px] p-6 sm:p-7">
                <div className="flex items-center justify-between"><span className="font-mono text-sm font-bold text-[#b8ff5c]">{String(index + 1).padStart(2, "0")}</span><FiLayers className="text-zinc-600" aria-hidden="true" /></div>
                <h3 className="mt-6 text-xl font-bold text-white">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-zinc-400">{description}</p>
                <p className="mt-5 border-t border-white/[.07] pt-4 text-[10px] font-bold uppercase tracking-[.08em] text-zinc-500">{topics.join(" • ")}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section border-y border-white/[.07] bg-[#090c12]" aria-labelledby="publico-title">
        <div className="container-default">
          <div className="max-w-3xl">
            <span className="eyebrow">Para quem é</span>
            <h2 id="publico-title" className="display-title mt-5 text-4xl font-semibold leading-[1.02] text-white sm:text-5xl md:text-6xl">Feito para quem quer<br />crescer com método.</h2>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 md:mt-16 lg:grid-cols-5">
            {product.audience.map(({ title, description }, index) => {
              const Icon = audienceIcons[index % audienceIcons.length];
              return (
              <article key={title} className="rounded-[24px] border border-white/[.08] bg-white/[.025] p-6 transition-[transform,border-color,background-color] duration-300 hover:-translate-y-1 hover:border-blue-300/[.18] hover:bg-white/[.04]">
                <Icon className="text-2xl text-[#b8ff5c]" aria-hidden="true" />
                <h3 className="mt-6 font-bold text-white">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-zinc-400">{description}</p>
              </article>
              );
            })}
          </div>

          <div className="relative mt-16 overflow-hidden rounded-[32px] border border-[#b8ff5c]/25 bg-gradient-to-br from-[#b8ff5c]/[.1] via-[#10160e] to-[#0b0f16] p-7 shadow-[0_28px_90px_rgba(0,0,0,.25)] sm:p-10 lg:grid lg:grid-cols-[.72fr_1.28fr] lg:items-center lg:gap-12 lg:p-12">
            <div className="absolute -right-16 -top-24 h-72 w-72 rounded-full bg-[#b8ff5c]/10 blur-[90px]" />
            <div className="relative grid h-24 w-24 place-items-center rounded-[28px] border border-[#b8ff5c]/20 bg-[#b8ff5c]/10 text-4xl text-[#b8ff5c] shadow-[0_18px_55px_rgba(184,255,92,.08)]"><FiShield aria-hidden="true" /></div>
            <div className="relative mt-8 lg:mt-0">
              <span className="eyebrow">Garantia EscalaHub</span>
              <h2 className="display-title mt-3 text-4xl font-semibold text-white sm:text-5xl">Você compra sem risco.</h2>
              <p className="mt-5 max-w-2xl leading-8 text-zinc-300">Acesse o conteúdo, avalie com calma e comece a aplicar. Se dentro de {product.guaranteeDays} dias você entender que o material não é para você, basta solicitar o reembolso.</p>
              <div className="mt-6 flex flex-wrap gap-4 text-sm font-bold text-white"><span className="flex items-center gap-2"><FiRefreshCw className="text-[#b8ff5c]" /> {product.guaranteeDays} dias para avaliar</span><span className="flex items-center gap-2"><FiCheck className="text-[#b8ff5c]" /> Compra sem risco</span></div>
            </div>
          </div>
        </div>
      </section>

      {product.testimonials.length > 0 ? <section className="section" aria-labelledby="depoimentos-title">
        <div className="container-default">
          <div className="grid gap-7 md:grid-cols-[1fr_.8fr] md:items-end">
            <div><span className="eyebrow">Prova social verificada</span><h2 id="depoimentos-title" className="display-title mt-5 text-4xl font-semibold text-white sm:text-5xl md:text-6xl">Experiências de alunos.</h2></div>
            <p className="max-w-lg leading-7 text-zinc-400 md:justify-self-end">Esta seção exibirá somente relatos reais e autorizados de clientes da EscalaHub.</p>
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {product.testimonials.map(({ name, role, quote }) => (
              <figure key={name} className="card rounded-[24px] p-7"><FiMessageSquare className="text-2xl text-[#b8ff5c]" /><blockquote className="mt-6 leading-7 text-zinc-300">“{quote}”</blockquote><figcaption className="mt-7 border-t border-white/[.07] pt-5"><strong className="block text-sm text-white">{name}</strong><span className="mt-1 block text-xs text-zinc-500">{role}</span></figcaption></figure>
            ))}
          </div>
        </div>
      </section> : null}

      <section className="section border-y border-white/[.07] bg-[#090c12]" aria-labelledby="faq-produto-title">
        <div className="container-default grid gap-12 lg:grid-cols-[.72fr_1.28fr] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:h-fit"><span className="eyebrow">Dúvidas frequentes</span><h2 id="faq-produto-title" className="display-title mt-5 text-4xl font-semibold text-white sm:text-5xl md:text-6xl">Antes de comprar.</h2><p className="mt-5 max-w-md leading-7 text-zinc-400">Informações claras para você tomar sua decisão com segurança.</p></div>
          <div className="divide-y divide-white/[.08] border-y border-white/[.08]">
            {product.faq.map(({ question, answer }) => (
              <details key={question} className="group py-1">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 rounded-xl py-6 text-left text-lg font-bold tracking-[-.015em] text-white outline-none transition-colors hover:text-[#b8ff5c] focus-visible:ring-2 focus-visible:ring-[#3B82F6] focus-visible:ring-offset-4 focus-visible:ring-offset-[#090c12]">
                  <span>{question}</span>
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/[.1] bg-white/[.035] text-zinc-400 transition-[transform,color,border-color] duration-300 group-open:rotate-45 group-open:border-[#b8ff5c]/30 group-open:text-[#b8ff5c]"><FiPlus aria-hidden="true" /></span>
                </summary>
                <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-300 group-open:grid-rows-[1fr]"><div className="overflow-hidden"><p className="max-w-2xl pb-6 pr-10 leading-7 text-zinc-400">{answer}</p></div></div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-5 sm:py-20" aria-labelledby="cta-produto-title">
        <div className="noise relative mx-auto max-w-[1180px] overflow-hidden rounded-[30px] bg-[#b8ff5c] px-6 py-16 text-center text-[#080a0e] shadow-[0_32px_100px_rgba(134,204,54,.16)] sm:rounded-[36px] md:py-24">
          <div className="premium-grid pointer-events-none absolute inset-0 opacity-20" />
          <div className="relative">
            <p className="text-xs font-black uppercase tracking-[.16em]">Acesso após a confirmação do pagamento</p>
            <h2 id="cta-produto-title" className="display-title mt-5 text-5xl font-semibold leading-[.95] md:text-7xl">Anuncie com mais clareza.<br />Otimize com método.</h2>
            <p className="mx-auto mt-6 max-w-xl text-lg text-black/65">Pagamento único, acesso permanente e {product.guaranteeDays} dias para avaliar o conteúdo.</p>
            <div className="mt-8 text-4xl font-black">{formattedPrice}</div>
            <Button asChild variant="secondary" size="lg" className="group mt-7 border-[#080a0e] bg-[#080a0e] px-8 !text-white hover:bg-[#171b24] focus-visible:ring-[#080a0e] focus-visible:ring-offset-[#b8ff5c]">
              <Link href={product.checkoutUrl}>Quero acesso ao guia <FiArrowRight className="transition-transform group-hover:translate-x-1" /></Link>
            </Button>
            <p className="mt-5 flex items-center justify-center gap-2 text-xs font-semibold text-black/60"><FiCheckCircle /> Pagamento único • Garantia de {product.guaranteeDays} dias</p>
          </div>
        </div>
      </section>
    </>
  );
}
