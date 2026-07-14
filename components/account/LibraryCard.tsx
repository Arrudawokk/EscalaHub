import Image from "next/image";
import Link from "next/link";
import { FiArrowUpRight, FiDownloadCloud } from "react-icons/fi";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { LibraryProduct } from "@/lib/account/data";

export function LibraryCard({ item }: { item: LibraryProduct }) {
  return (
    <article className="card interactive-card overflow-hidden p-0">
      <div className="relative aspect-[16/9] overflow-hidden bg-white/[.03]"><Image src={item.product.coverImage} alt={`Capa de ${item.product.title}`} fill sizes="(max-width: 768px) 100vw, 420px" className="object-contain p-5" /></div>
      <div className="p-5 sm:p-6"><div className="flex flex-wrap items-center gap-2"><Badge variant="success">Acesso liberado</Badge><span className="text-xs text-zinc-500">{item.category}</span></div><h2 className="mt-4 text-xl font-black tracking-[-.02em] text-white">{item.product.title}</h2><p className="mt-2 line-clamp-2 text-sm leading-6 text-zinc-400">{item.product.shortDescription}</p><p className="mt-4 text-xs text-zinc-500">Comprado em {new Intl.DateTimeFormat("pt-BR", { dateStyle: "long" }).format(new Date(item.purchasedAt))}</p><div className="mt-6 grid gap-2 sm:grid-cols-2"><Button asChild><a href={item.downloadUrl}><FiDownloadCloud />Baixar</a></Button><Button asChild variant="outline"><Link href={item.accessUrl}>Acessar<FiArrowUpRight /></Link></Button></div></div>
    </article>
  );
}
