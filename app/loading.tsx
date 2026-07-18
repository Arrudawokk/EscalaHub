import { BrandLogo } from "@/components/brand/BrandLogo";

export default function Loading() {
  return (
    <main className="noise min-h-screen overflow-hidden bg-[#070a10]" aria-busy="true" aria-live="polite">
      <span className="sr-only">Carregando conteúdo</span>
      <div className="premium-grid pointer-events-none fixed inset-0 opacity-35" />
      <div className="border-b border-white/[.07] bg-[#070a10]/85">
        <div className="container-default flex h-[76px] items-center justify-between">
          <BrandLogo imageClassName="h-11 w-11" />
          <div className="skeleton h-10 w-28 rounded-full" />
        </div>
      </div>
      <div className="container-default grid gap-12 py-16 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:py-24">
        <div>
          <div className="skeleton h-7 w-44 rounded-full" />
          <div className="skeleton mt-7 h-16 w-full max-w-xl rounded-2xl sm:h-24" />
          <div className="skeleton mt-4 h-16 w-4/5 max-w-lg rounded-2xl" />
          <div className="skeleton mt-8 h-14 w-60 rounded-full" />
        </div>
        <div className="skeleton mx-auto aspect-[4/5] w-full max-w-md rounded-[32px]" />
      </div>
    </main>
  );
}
