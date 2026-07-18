"use client";

import { FiRefreshCw } from "react-icons/fi";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { Button } from "@/components/ui/Button";
import "./globals.css";

export default function GlobalError({ unstable_retry }: { error: Error & { digest?: string }; unstable_retry: () => void }) {
  return (
    <html lang="pt-BR" className="dark">
      <body>
        <main className="noise grid min-h-screen place-items-center bg-[#070a10] px-5 py-20 text-center">
          <div className="card w-full max-w-xl p-7 sm:p-12">
            <BrandLogo className="justify-center" imageClassName="h-16 w-16" />
            <p className="eyebrow justify-center">Erro inesperado</p>
            <h1 className="display-title mt-5 text-4xl font-semibold text-white sm:text-5xl">A EscalaHub precisa recarregar.</h1>
            <p className="mt-5 leading-7 text-zinc-400">Seus dados não foram enviados. Tente carregar a aplicação novamente.</p>
            <Button size="lg" className="mt-8" onClick={unstable_retry}><FiRefreshCw /> Recarregar aplicação</Button>
          </div>
        </main>
      </body>
    </html>
  );
}
