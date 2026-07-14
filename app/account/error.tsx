"use client";

import Link from "next/link";
import { FiAlertCircle, FiRefreshCw } from "react-icons/fi";
import { Button } from "@/components/ui/Button";

export default function AccountError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <main className="grid min-h-screen place-items-center bg-[#070a10] px-5 py-16 text-center text-white"><section className="card w-full max-w-lg p-8"><FiAlertCircle className="mx-auto text-4xl text-amber-300" /><h1 className="display-title mt-5 text-3xl font-semibold">Não foi possível carregar sua conta.</h1><p className="mt-3 text-sm leading-6 text-zinc-400">Seus produtos continuam protegidos. Tente novamente ou volte para a página inicial.</p><div className="mt-7 grid gap-2 sm:grid-cols-2"><Button type="button" onClick={reset}><FiRefreshCw />Tentar novamente</Button><Button asChild variant="outline"><Link href="/">Voltar ao início</Link></Button></div></section></main>;
}
