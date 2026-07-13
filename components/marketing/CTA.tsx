import Link from "next/link";
import { FiArrowRight as ArrowRight } from "react-icons/fi";
import { Button } from "@/components/ui/Button";
import { getProductPath, type Product } from "@/lib/catalog";

export function CTA({ product }: { product: Product }) {
  return (
    <section className="px-5 pb-12">
      <div className="noise relative mx-auto max-w-[1216px] overflow-hidden rounded-[40px] bg-[#b8ff5c] px-6 py-20 text-center text-[#080a0e] shadow-[0_35px_110px_rgba(184,255,92,.1)] transition duration-500 hover:shadow-[0_40px_130px_rgba(184,255,92,.16)] md:py-28">
        <div className="absolute -left-24 -top-40 h-96 w-96 rounded-full border-[70px] border-black/[.05]" />
        <div className="absolute -right-24 -bottom-52 h-96 w-96 rounded-full border-[70px] border-black/[.045]" /><div className="relative mx-auto max-w-3xl"><span className="text-xs font-black uppercase tracking-[.16em]">Um investimento. Acesso permanente.</span><h2 className="display-title mt-5 text-5xl font-semibold leading-[.92] md:text-7xl">Tenha um processo claro<br />antes do próximo anúncio.</h2><p className="mx-auto mt-7 max-w-xl text-lg text-black/60">{product.shortDescription}</p><Button asChild variant="secondary" size="lg" className="mt-10 border-[#080a0e] bg-[#080a0e] px-8 text-white shadow-[0_18px_40px_rgba(0,0,0,.2)] hover:bg-[#171b24] dark:border-[#080a0e] dark:bg-[#080a0e] dark:text-white dark:hover:bg-[#171b24]"><Link href={getProductPath(product)}>Ver o guia completo <ArrowRight /></Link></Button></div>
      </div>
    </section>
  );
}
