import Link from "next/link";
import { FiArrowRight, FiCheck, FiFileText, FiLock, FiShield } from "react-icons/fi";
import { Button } from "@/components/ui/Button";
import { formatProductPrice, type Product } from "@/lib/catalog";

export function PriceCard({ product }: { product: Product }) {
  const formattedPrice = formatProductPrice(product);
  return (
    <div id="comprar" className="glass relative mt-8 overflow-hidden rounded-[28px] border-white/[.11] p-5 shadow-[0_24px_70px_rgba(0,0,0,.24)] sm:p-6">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#b8ff5c]/65 to-transparent" />
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[.16em] text-[#b8ff5c]">Pagamento único</p>
          <div className="mt-2 flex items-end gap-3">
            <p className="display-title text-4xl font-black tracking-[-.045em] text-white sm:text-5xl">{formattedPrice}</p>
          </div>
          <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-zinc-400"><FiCheck className="text-[#b8ff5c]" /> Acesso permanente ao material</p>
        </div>
        <Button asChild size="lg" className="group w-full justify-between px-6 shadow-[0_14px_42px_rgba(134,204,54,.24)] focus-visible:ring-[#b8ff5c] sm:w-auto sm:min-w-64">
          <Link href={product.checkoutUrl} aria-label={`Garantir acesso a ${product.title} por ${formattedPrice}`}>
            Garantir meu acesso
            <FiArrowRight className="transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </Button>
      </div>
      <div className="mt-5 grid gap-3 border-t border-white/[.075] pt-4 text-[11px] font-medium text-zinc-400 sm:grid-cols-3">
        <span className="flex items-center gap-2"><FiLock className="text-blue-400" /> Compra segura</span>
        <span className="flex items-center gap-2"><FiShield className="text-[#b8ff5c]" /> Garantia de {product.guaranteeDays} dias</span>
        <span className="flex items-center gap-2"><FiFileText className="text-violet-400" /> {product.format}</span>
      </div>
    </div>
  );
}
