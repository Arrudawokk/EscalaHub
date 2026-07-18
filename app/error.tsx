"use client";

import Link from "next/link";
import { FiHome, FiRefreshCw } from "react-icons/fi";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { Button } from "@/components/ui/Button";

export default function ErrorPage({ unstable_retry }: { error: Error & { digest?: string }; unstable_retry: () => void }) {
  return (
    <main className="noise relative grid min-h-screen place-items-center overflow-hidden bg-[#070a10] px-5 py-20 text-center">
      <div className="premium-grid pointer-events-none absolute inset-0 opacity-45" />
      <div className="card relative mx-auto max-w-xl p-7 backdrop-blur-2xl sm:p-12">
        <BrandLogo className="justify-center" imageClassName="h-16 w-16" />
        <p className="eyebrow justify-center">Algo não saiu como esperado</p>
        <h1 className="display-title mt-5 text-4xl font-semibold text-white sm:text-5xl">Não foi possível carregar esta página.</h1>
        <p className="mx-auto mt-5 max-w-md leading-7 text-zinc-400">Tente novamente. Se o problema continuar, você ainda pode retornar ao início com segurança.</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button size="lg" onClick={unstable_retry}><FiRefreshCw /> Tentar novamente</Button>
          <Button asChild size="lg" variant="outline"><Link href="/"><FiHome /> Voltar ao início</Link></Button>
        </div>
      </div>
    </main>
  );
}
