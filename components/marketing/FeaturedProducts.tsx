import Image from "next/image";
import Link from "next/link";
import {
  FiArrowUpRight as ArrowUpRight,
  FiBarChart2 as BarChart2,
  FiCheckCircle as CheckCircle,
  FiDownloadCloud as DownloadCloud,
  FiLayers as Layers,
  FiShield as Shield,
  FiTarget as Target,
} from "react-icons/fi";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatProductPrice, getCategoryBySlug, getProductPath, type Product } from "@/lib/catalog";

const outcomeIcons = [Target, BarChart2, Layers];

export function FeaturedProducts({ products }: { products: Product[] }) {
  const product = products[0];
  if (!product) return null;

  const category = getCategoryBySlug(product.category);
  const outcomes = product.benefits.slice(0, 3);
  return (
    <section id="produto" className="section relative overflow-hidden border-y border-white/[.055] bg-[#090c12]">
      <div className="premium-grid pointer-events-none absolute inset-x-0 top-0 h-[620px] opacity-45" />
      <div className="pointer-events-none absolute -left-40 top-16 h-[420px] w-[420px] rounded-full bg-blue-600/[.07] blur-[130px]" />
      <div className="pointer-events-none absolute -right-44 top-60 h-[460px] w-[460px] rounded-full bg-violet-600/[.07] blur-[140px]" />

      <div className="container-default relative">
        <div className="grid items-end gap-7 md:grid-cols-[1.1fr_.9fr] md:gap-12">
          <div>
            <span className="eyebrow">Produto em destaque</span>
            <h2 className="display-title mt-5 max-w-3xl text-4xl font-semibold leading-[1.02] text-white sm:text-5xl md:text-6xl">
              Pare de investir no escuro.<br className="hidden sm:block" /> Anuncie com método.
            </h2>
          </div>
          <p className="max-w-lg text-base leading-7 text-zinc-300 sm:text-lg sm:leading-8 md:justify-self-end">
            Entenda o que planejar, quais métricas acompanhar e quando otimizar antes de aumentar seu investimento.
          </p>
        </div>

        <article className="group/product relative mt-14 grid overflow-hidden rounded-[28px] border border-white/[.09] bg-[#0d1119] shadow-[0_28px_90px_rgba(0,0,0,.24),inset_0_1px_rgba(255,255,255,.04)] transition-[transform,border-color,box-shadow] duration-500 ease-out hover:-translate-y-1 hover:scale-[1.003] hover:border-blue-300/[.18] hover:shadow-[0_38px_110px_rgba(0,0,0,.38),0_0_70px_rgba(59,130,246,.07),inset_0_1px_rgba(255,255,255,.055)] sm:mt-16 sm:rounded-[36px] lg:grid-cols-[.92fr_1.08fr] xl:grid-cols-[.88fr_1.12fr]">
          <div className="relative flex min-h-[440px] items-center justify-center overflow-hidden border-b border-white/[.07] bg-gradient-to-br from-violet-700/[.22] via-[#10182a] to-blue-500/[.09] p-8 sm:min-h-[560px] sm:p-12 lg:min-h-[650px] lg:border-b-0 lg:border-r">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_44%_36%,rgba(108,92,231,.38),transparent_56%)] transition-opacity duration-500 group-hover/product:opacity-90" />
            <div className="premium-grid absolute inset-0 opacity-25 [mask-image:linear-gradient(to_bottom,black,transparent_88%)]" />
            <div className="absolute left-1/2 top-1/2 h-[62%] w-[62%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-400/[.17] blur-[85px] transition-transform duration-700 group-hover/product:scale-110" />

            <div className="relative flex h-full w-full items-center justify-center">
              <div className="absolute bottom-[4%] h-14 w-[72%] rounded-full bg-black/60 blur-2xl transition-[transform,opacity] duration-500 group-hover/product:scale-110 group-hover/product:opacity-75" />
              <Image
                src={product.coverImage}
                alt={`Capa de ${product.title}`}
                width={1024}
                height={1536}
                sizes="(max-width: 640px) 74vw, (max-width: 1024px) 440px, 470px"
                className="relative h-auto max-h-[390px] w-auto max-w-full rounded-[18px] object-contain shadow-[0_38px_100px_rgba(0,0,0,.62),0_0_55px_rgba(59,130,246,.12)] transition-[transform,filter] duration-500 ease-out group-hover/product:-translate-y-1.5 group-hover/product:scale-[1.018] sm:max-h-[510px] lg:max-h-[555px]"
              />
            </div>

            <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full border border-white/[.1] bg-[#080b11]/75 px-3 py-2 text-[10px] font-bold uppercase tracking-[.12em] text-zinc-200 shadow-lg backdrop-blur-xl sm:left-7 sm:top-7">
              <DownloadCloud className="text-[#b8ff5c]" /> Acesso após confirmação
            </div>
          </div>

          <div className="relative flex flex-col justify-center p-7 sm:p-10 md:p-12 lg:p-12 xl:p-16">
            <div className="pointer-events-none absolute right-0 top-0 h-52 w-52 rounded-full bg-blue-500/[.055] blur-[80px]" />

            <div className="relative flex flex-wrap items-center gap-2">
              <Badge variant="success" className="border-[#b8ff5c]/30 bg-[#182b0b] px-3.5 py-1.5 text-[#d9ffab] shadow-[0_8px_24px_rgba(184,255,92,.06)]">{product.badge ?? "Destaque"}</Badge>
              <Badge variant="neutral" className="border-white/[.1] bg-white/[.055] px-3.5 py-1.5 text-zinc-200">{product.format} • {category?.name}</Badge>
            </div>

            <h3 className="display-title relative mt-6 text-[2.15rem] font-semibold leading-[1.02] text-white sm:text-5xl xl:text-[3.35rem]">
              {product.title}
            </h3>
            <p className="relative mt-5 max-w-xl text-[15px] leading-7 text-zinc-300 sm:mt-6 sm:text-base">
              {product.description}
            </p>

            <div className="relative mt-7 border-y border-white/[.075] py-6 sm:mt-8">
              <span className="text-[10px] font-bold uppercase tracking-[.14em] text-zinc-500">Investimento único</span>
              <div className="mt-1.5 flex flex-wrap items-end gap-x-3 gap-y-1">
                <strong className="display-title text-4xl font-bold tracking-[-.045em] text-white sm:text-5xl">{formatProductPrice(product)}</strong>
                <span className="pb-1 text-sm font-medium text-zinc-400">pagamento único</span>
              </div>
            </div>

            <Button asChild size="lg" className="group/cta relative mt-7 w-full justify-between px-6 text-sm shadow-[0_14px_42px_rgba(134,204,54,.24)] focus-visible:ring-[#b8ff5c] sm:mt-8 sm:w-fit sm:min-w-56">
              <Link href={getProductPath(product)}>
                Ver detalhes e acessar por {formatProductPrice(product)}
                <ArrowUpRight className="transition-transform duration-200 group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5" />
              </Link>
            </Button>

            <div className="relative mt-6 flex flex-wrap gap-x-5 gap-y-3 text-xs font-medium text-zinc-400">
              <span className="flex items-center gap-2"><CheckCircle className="text-[#b8ff5c]" /> Acesso {product.accessLabel.toLowerCase()}</span>
              <span className="flex items-center gap-2"><Shield className="text-[#b8ff5c]" /> {product.guaranteeDays} dias de garantia</span>
            </div>
          </div>
        </article>

        <div id="beneficios" className="mt-6 grid gap-4 sm:mt-8 md:grid-cols-3">
          {outcomes.map(({ title, description }, index) => {
            const Icon = outcomeIcons[index % outcomeIcons.length];
            return (
            <article key={title} className="card interactive-card rounded-[24px] p-7 sm:p-8 md:p-7 xl:p-9">
              <div className="flex items-start justify-between">
                <span className="grid h-11 w-11 place-items-center rounded-2xl border border-[#b8ff5c]/10 bg-[#b8ff5c]/[.08] text-xl text-[#b8ff5c] shadow-[inset_0_1px_rgba(255,255,255,.04)]"><Icon /></span>
                <span className="text-[10px] font-bold tracking-[.14em] text-zinc-600">0{index + 1}</span>
              </div>
              <h3 className="mt-7 text-lg font-bold tracking-[-.02em] text-white sm:text-xl">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-zinc-400 sm:text-base sm:leading-7">{description}</p>
            </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
