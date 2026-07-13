import { FiCheck as Check } from "react-icons/fi";
import type { Product } from "@/lib/catalog";

export function Categories({ product }: { product: Product }) {
  const topics = product.modules.map((module) => module.title);
  return (
    <section className="section relative overflow-hidden">
      <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-violet-700/10 blur-[150px]" />
      <div className="container-default relative grid gap-16 lg:grid-cols-2">
        <div><span className="eyebrow">Conteúdo completo</span><h2 className="display-title mt-5 text-4xl font-semibold leading-tight md:text-6xl">Menos teoria solta.<br /><span className="text-zinc-600">Mais clareza para agir.</span></h2></div>
        <div className="grid gap-3 sm:grid-cols-2">
          {topics.map((topic, index) => <div key={topic} className="glass interactive-card flex min-h-28 items-center gap-4 rounded-2xl p-6"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#b8ff5c]/10 text-[#b8ff5c]"><Check /></span><span className="font-semibold tracking-[-.015em]">{topic}</span><span className="ml-auto self-start text-[9px] font-bold text-zinc-700">0{index + 1}</span></div>)}
        </div>
      </div>
    </section>
  );
}
