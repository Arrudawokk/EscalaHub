import Link from "next/link";
import { FiArrowLeft, FiCompass } from "react-icons/fi";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/Button";
import { getDefaultProduct, getProductPath } from "@/lib/catalog";

export default function NotFound() {
  const productHref = getProductPath(getDefaultProduct());
  return (
    <>
      <title>Página não encontrada | EscalaHub</title>
      <Header productHref={productHref} />
      <main className="noise relative grid min-h-[calc(100vh-76px)] place-items-center overflow-hidden bg-[#070a10] px-5 pb-20 pt-36 text-center">
        <div className="premium-grid pointer-events-none absolute inset-0 opacity-55" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[440px] w-[440px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/[.12] blur-[140px]" />
        <div className="relative mx-auto max-w-2xl">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-blue-300/[.16] bg-blue-400/[.08] text-2xl text-blue-300 shadow-[0_18px_55px_rgba(59,130,246,.12)]"><FiCompass aria-hidden="true" /></span>
          <p className="eyebrow mt-8 justify-center">Erro 404</p>
          <h1 className="display-title mt-5 text-5xl font-semibold leading-[.95] text-white sm:text-7xl">Esta página saiu da rota.</h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-zinc-300 sm:text-lg sm:leading-8">O endereço pode ter mudado ou não existe mais. Volte ao início para continuar navegando pela EscalaHub.</p>
          <Button asChild size="lg" className="group mt-9 min-w-56">
            <Link href="/"><FiArrowLeft className="transition-transform group-hover:-translate-x-1" /> Voltar para o início</Link>
          </Button>
        </div>
      </main>
      <Footer />
    </>
  );
}
