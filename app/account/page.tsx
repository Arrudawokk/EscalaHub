import Link from "next/link";
import { FiArrowRight, FiBookOpen, FiCheckCircle, FiClipboard, FiShield } from "react-icons/fi";
import { AccountShell } from "@/components/account/AccountShell";
import { LibraryCard } from "@/components/account/LibraryCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { getCustomerAccountData } from "@/lib/account/data";

export default async function AccountPage() {
  const data = await getCustomerAccountData();
  const approvedOrders = data.orders.filter((order) => order.status === "approved").length;
  return (
    <AccountShell profile={data.profile}>
      <div><p className="eyebrow">Área do cliente</p><h1 className="display-title mt-4 text-3xl font-semibold sm:text-4xl">Olá, {data.profile.name?.split(" ")[0] || "cliente"}.</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">Seus produtos, downloads e pedidos ficam organizados em um ambiente protegido.</p></div>
      <section className="mt-8 grid gap-4 sm:grid-cols-3" aria-label="Resumo da conta">
        {[{ icon: FiBookOpen, label: "Produtos liberados", value: data.library.length }, { icon: FiClipboard, label: "Pedidos", value: data.orders.length }, { icon: FiCheckCircle, label: "Compras aprovadas", value: approvedOrders }].map(({ icon: Icon, label, value }) => <article key={label} className="card p-5"><Icon className="text-xl text-[#b8ff5c]" aria-hidden="true" /><p className="mt-5 text-xs font-semibold text-zinc-500">{label}</p><strong className="mt-1 block text-2xl text-white">{value}</strong></article>)}
      </section>
      <section className="mt-10" aria-labelledby="account-products-title"><div className="flex items-end justify-between gap-4"><div><Badge variant="success"><FiShield />Acesso protegido</Badge><h2 id="account-products-title" className="mt-4 text-2xl font-black text-white">Seus produtos</h2></div>{data.library.length > 0 ? <Button asChild variant="ghost"><Link href="/account/meus-produtos">Ver biblioteca <FiArrowRight /></Link></Button> : null}</div>{data.library.length > 0 ? <div className="mt-5 grid gap-5 xl:grid-cols-2">{data.library.slice(0, 2).map((item) => <LibraryCard key={item.orderId} item={item} />)}</div> : <div className="card mt-5 p-8 text-center"><FiBookOpen className="mx-auto text-3xl text-zinc-600" /><h3 className="mt-4 text-lg font-bold">Sua biblioteca está vazia</h3><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-500">Quando um pagamento for aprovado, o produto aparecerá aqui automaticamente.</p><Button asChild className="mt-6"><Link href="/#produto">Conhecer produtos</Link></Button></div>}</section>
    </AccountShell>
  );
}
