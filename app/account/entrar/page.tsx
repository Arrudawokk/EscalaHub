import Link from "next/link";
import { redirect } from "next/navigation";
import { FiArrowLeft, FiLock, FiMail, FiPackage } from "react-icons/fi";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { getCustomerSession } from "@/lib/account/session";
import { accessAccount } from "../actions";

export default async function AccountLoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  if (await getCustomerSession()) redirect("/account");
  const { error } = await searchParams;

  return (
    <main className="noise relative grid min-h-screen place-items-center overflow-hidden bg-[#070a10] px-5 py-16">
      <div className="premium-grid pointer-events-none fixed inset-0 opacity-25" />
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-600/10 blur-[130px]" />
      <section className="card relative w-full max-w-lg p-7 sm:p-10" aria-labelledby="account-login-title">
        <Link href="/" className="inline-flex min-h-11 items-center rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6]" aria-label="EscalaHub — início">
          <BrandLogo imageClassName="h-14 w-14" />
        </Link>
        <Link href="/" className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-lg text-sm font-semibold text-zinc-400 outline-none hover:text-white focus-visible:ring-2 focus-visible:ring-[#3B82F6]">
          <FiArrowLeft /> Voltar para a EscalaHub
        </Link>
        <span className="mt-7 grid h-14 w-14 place-items-center rounded-2xl bg-[#b8ff5c]/15 text-xl text-[#b8ff5c]"><FiLock /></span>
        <p className="eyebrow mt-7">Área protegida</p>
        <h1 id="account-login-title" className="display-title mt-4 text-3xl font-semibold sm:text-4xl">Acesse suas compras.</h1>
        <p className="mt-4 text-sm leading-6 text-zinc-400">Informe o e-mail usado na compra e o código do pedido aprovado. Após o checkout, o acesso acontece automaticamente.</p>
        {error ? <div role="alert" className="mt-5 rounded-xl border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-100">{error}</div> : null}
        <form action={accessAccount} className="mt-7 space-y-5">
          <label className="block">
            <span className="mb-2 flex items-center gap-2 text-xs font-bold text-zinc-300"><FiMail /> E-mail da compra</span>
            <Input name="email" type="email" inputMode="email" autoComplete="email" required maxLength={254} placeholder="voce@exemplo.com" />
          </label>
          <label className="block">
            <span className="mb-2 flex items-center gap-2 text-xs font-bold text-zinc-300"><FiPackage /> Código do pedido</span>
            <Input name="orderId" autoComplete="off" required pattern="[0-9a-fA-F-]{36}" maxLength={36} placeholder="00000000-0000-0000-0000-000000000000" />
          </label>
          <Button type="submit" size="lg" className="w-full">Acessar meus produtos</Button>
        </form>
        <p className="mt-5 text-center text-xs leading-5 text-zinc-600">O código aparece na confirmação da compra. Seus dados são validados no servidor e não são expostos no navegador.</p>
      </section>
    </main>
  );
}
