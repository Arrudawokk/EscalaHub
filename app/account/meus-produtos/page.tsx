import { FiBookOpen } from "react-icons/fi";
import { AccountShell } from "@/components/account/AccountShell";
import { LibraryCard } from "@/components/account/LibraryCard";
import { getCustomerAccountData } from "@/lib/account/data";

export default async function CustomerLibraryPage() {
  const data = await getCustomerAccountData();
  return <AccountShell profile={data.profile}><p className="eyebrow">Biblioteca</p><h1 className="display-title mt-4 text-3xl font-semibold sm:text-4xl">Meus produtos</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">Acesse e baixe apenas os produtos vinculados às suas compras aprovadas.</p>{data.library.length ? <div className="mt-8 grid gap-5 xl:grid-cols-2">{data.library.map((item) => <LibraryCard key={item.orderId} item={item} />)}</div> : <div className="card mt-8 p-10 text-center"><FiBookOpen className="mx-auto text-4xl text-zinc-600" /><h2 className="mt-4 text-xl font-bold">Nenhum produto liberado</h2><p className="mt-2 text-sm text-zinc-500">Produtos aparecem aqui após a confirmação do pagamento.</p></div>}</AccountShell>;
}
