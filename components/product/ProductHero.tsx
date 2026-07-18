import Image from "next/image";
import Link from "next/link";
import { FiArrowLeft, FiCheckCircle, FiClock, FiDownloadCloud, FiFileText, FiShield } from "react-icons/fi";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatProductPrice, getCategoryBySlug, type Product } from "@/lib/catalog";
import { PriceCard } from "./PriceCard";

export function ProductHero({ product }: { product: Product }) {
  const category = getCategoryBySlug(product.category);
  const formattedPrice = formatProductPrice(product);
  const [titleLead, ...titleRest] = product.title.split(":");
  const productDetails = [
    { icon: FiDownloadCloud, label: "Acesso", value: product.accessLabel },
    { icon: FiFileText, label: "Formato", value: product.format },
    { icon: FiClock, label: "Leitura", value: "No seu ritmo" },
    { icon: FiShield, label: "Garantia", value: `${product.guaranteeDays} dias` },
  ];
  return (
    <section className="noise relative overflow-hidden border-b border-white/[.055] bg-[#070a10] pb-32 pt-[92px] sm:pb-28 sm:pt-[124px]">
      <div className="premium-grid pointer-events-none absolute inset-0 opacity-65" />
      <div className="pointer-events-none absolute left-[-15%] top-[-20%] h-[680px] w-[680px] rounded-full bg-blue-600/[.15] blur-[165px]" />
      <div className="pointer-events-none absolute right-[-18%] top-[15%] h-[560px] w-[560px] rounded-full bg-violet-600/[.09] blur-[150px]" />

      <div className="container-default relative">
        <Link href="/" className="hidden min-h-11 items-center gap-2 rounded-lg py-2 text-sm font-semibold text-zinc-300 outline-none transition-[color,transform] hover:-translate-x-0.5 hover:text-white focus-visible:ring-2 focus-visible:ring-[#3B82F6] focus-visible:ring-offset-4 focus-visible:ring-offset-[#070a10] sm:inline-flex" aria-label="Voltar para a página inicial">
          <FiArrowLeft /> Voltar para o início
        </Link>

        <div className="mt-4 grid items-center gap-14 sm:mt-9 lg:grid-cols-[.9fr_1.1fr] lg:gap-16 xl:gap-20">
          <div className="order-2 relative mx-auto w-full max-w-[500px] lg:order-none lg:mx-0">
            <div className="pointer-events-none absolute inset-[8%] rounded-full bg-blue-500/25 blur-[90px]" />
            <div className="relative px-4 py-5 sm:px-8">
              <div className="book-3d relative rounded-[30px] border border-blue-200/[.16] bg-gradient-to-br from-[#121b2b] via-[#0a0f18] to-[#06080d] p-2.5 shadow-[0_48px_120px_rgba(0,0,0,.6),0_0_110px_rgba(59,130,246,.22),inset_0_1px_rgba(255,255,255,.08)]">
                <div className="absolute bottom-3 left-[-14px] top-3 w-4 rounded-l-md border-y border-l border-blue-200/[.12] bg-gradient-to-r from-[#030509] to-[#18243a] shadow-[-12px_16px_34px_rgba(0,0,0,.62)]" />
                <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-blue-200/55 to-transparent" />
                <Image
                  src={product.coverImage}
                  alt={`Capa de ${product.title}`}
                  width={1024}
                  height={1536}
                  preload
                  sizes="(max-width: 640px) 82vw, (max-width: 1024px) 470px, 460px"
                  className="h-auto w-full rounded-[21px] object-contain shadow-[0_20px_50px_rgba(0,0,0,.35)]"
                />
              </div>
            </div>
            <div className="glass absolute -bottom-2 right-0 flex items-center gap-2 rounded-full px-3.5 py-2 text-[10px] font-bold uppercase tracking-[.1em] text-[#b8ff5c] shadow-xl sm:right-4">
              <FiCheckCircle /> Produto digital
            </div>
          </div>

          <div className="order-1 relative z-10 lg:order-none">
            <div className="flex flex-wrap gap-2">
              <Badge variant="success" className="border-[#b8ff5c]/30 bg-[#182b0b] text-[#d9ffab]">{product.badge ?? "Produto premium"}</Badge>
              <Badge variant="neutral" className="border-white/[.1] bg-white/[.055] text-zinc-200">{category?.name}</Badge>
            </div>
            <h1 className="display-title mt-6 max-w-3xl text-[clamp(3.15rem,6vw,5.6rem)] font-semibold leading-[.92] text-white">
              {titleLead}{titleRest.length > 0 ? ":" : ""}<br />
              {titleRest.length > 0 ? <span className="gradient-text">{titleRest.join(":").trim()}</span> : null}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300 sm:text-xl sm:leading-9">
              {product.subtitle}
            </p>

            <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {productDetails.map(({ icon: Icon, label, value }) => (
                <div key={label} className="rounded-2xl border border-white/[.08] bg-white/[.03] p-3.5 shadow-[inset_0_1px_rgba(255,255,255,.03)] backdrop-blur-sm">
                  <Icon className="text-lg text-[#b8ff5c]" aria-hidden="true" />
                  <span className="mt-3 block text-[9px] font-bold uppercase tracking-[.12em] text-zinc-500">{label}</span>
                  <strong className="mt-1 block text-xs font-bold text-white">{value}</strong>
                </div>
              ))}
            </div>

            <PriceCard product={product} />
          </div>
        </div>
      </div>
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/[.1] bg-[#080b10]/94 px-4 py-3 shadow-[0_-18px_55px_rgba(0,0,0,.38)] backdrop-blur-2xl lg:hidden">
        <div className="mx-auto flex max-w-md items-center gap-3">
          <div className="shrink-0"><span className="block text-[9px] font-bold uppercase tracking-[.1em] text-zinc-500">Pagamento único</span><strong className="display-title mt-0.5 block text-xl font-black text-white">{formattedPrice}</strong></div>
          <Button asChild size="md" className="ml-auto h-12 min-w-44 flex-1 rounded-xl px-4 text-sm shadow-[0_12px_36px_rgba(134,204,54,.28)]">
            <Link href={product.checkoutUrl}>Quero acesso agora</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
