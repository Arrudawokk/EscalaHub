"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FiActivity, FiArrowUpRight, FiBell, FiChevronDown, FiCreditCard, FiDollarSign, FiExternalLink, FiGrid, FiHelpCircle, FiMenu, FiMoreHorizontal, FiPackage, FiPlus, FiSettings, FiShoppingBag, FiTrendingUp, FiUsers, FiX } from "react-icons/fi";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

const sales = [
  { customer: "Mariana Costa", email: "mariana@exemplo.com", value: "R$ 47,00", status: "Aprovado", time: "há 8 min" },
  { customer: "Lucas Almeida", email: "lucas@exemplo.com", value: "R$ 47,00", status: "Aprovado", time: "há 24 min" },
  { customer: "Beatriz Souza", email: "bia@exemplo.com", value: "R$ 47,00", status: "Pix pendente", time: "há 42 min" },
  { customer: "Rafael Lima", email: "rafael@exemplo.com", value: "R$ 47,00", status: "Aprovado", time: "há 1 h" },
];

export default function DashboardPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [period, setPeriod] = useState("Últimos 30 dias");
  const nav = [
    { icon: FiGrid, label: "Visão geral", active: true },
    { icon: FiShoppingBag, label: "Vendas" },
    { icon: FiPackage, label: "Produtos" },
    { icon: FiUsers, label: "Clientes" },
    { icon: FiCreditCard, label: "Financeiro" },
  ];

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");
    const syncViewport = () => {
      setIsDesktop(media.matches);
      if (media.matches) setMenuOpen(false);
    };

    syncViewport();
    media.addEventListener("change", syncViewport);
    return () => media.removeEventListener("change", syncViewport);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [menuOpen]);

  const navInteractive = isDesktop || menuOpen;

  return (
    <div data-dashboard className="relative min-h-screen bg-[#070a10] text-white">
      <div className="premium-grid pointer-events-none fixed inset-0 opacity-30" />
      {menuOpen && <Button variant="ghost" aria-label="Fechar menu" onClick={() => setMenuOpen(false)} className="fixed inset-0 z-40 h-auto w-auto rounded-none border-0 bg-black/70 p-0 text-transparent backdrop-blur-sm hover:translate-y-0 hover:bg-black/70 lg:hidden" />}
      <aside aria-label="Navegação do dashboard" aria-hidden={!navInteractive} inert={!navInteractive ? true : undefined} className={`fixed inset-y-0 left-0 z-50 flex w-[272px] flex-col border-r border-white/[.065] bg-[#090c12]/95 shadow-[24px_0_80px_rgba(0,0,0,.14)] backdrop-blur-2xl transition-transform duration-300 ease-out lg:translate-x-0 ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex h-20 items-center justify-between border-b border-white/[.07] px-6"><Link href="/" aria-label="EscalaHub — início" className="flex min-h-11 items-center gap-3 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-blue-400"><span aria-hidden="true" className="brand-mark">E</span><span className="brand-wordmark">EscalaHub</span></Link><Button variant="ghost" size="icon" onClick={() => setMenuOpen(false)} aria-label="Fechar menu" className="lg:hidden"><FiX /></Button></div>
        <div className="px-4 py-6"><Button variant="outline" className="h-auto w-full justify-start gap-3 rounded-2xl p-3 text-left"><span className="grid h-9 w-9 place-items-center rounded-xl bg-violet-500/20 text-sm font-black text-violet-200">PA</span><span className="min-w-0 flex-1"><strong className="block truncate text-sm">Pedro Arruda</strong><span className="block truncate text-xs text-zinc-400">EscalaHub</span></span><FiChevronDown className="text-zinc-400" /></Button></div>
        <nav className="flex-1 space-y-1 px-4" aria-label="Seções do dashboard">{nav.map(({ icon: Icon, label, active }) => <Button key={label} variant={active ? "primary" : "ghost"} aria-current={active ? "page" : undefined} onClick={() => setMenuOpen(false)} className="w-full justify-start"><Icon />{label}</Button>)}</nav>
        <div className="space-y-1 border-t border-white/[.07] p-4"><Button variant="ghost" className="w-full justify-start"><FiHelpCircle />Central de ajuda</Button><Button variant="ghost" className="w-full justify-start"><FiSettings />Configurações</Button></div>
      </aside>

      <div className="relative lg:pl-[272px]">
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-white/[.07] bg-[#070a10]/85 px-5 backdrop-blur-xl md:px-8"><div className="flex items-center gap-4"><Button variant="outline" size="icon" onClick={() => setMenuOpen(true)} aria-label="Abrir menu" className="lg:hidden"><FiMenu /></Button><div><h1 className="display-title text-xl font-bold">Visão geral</h1><p className="hidden text-xs text-zinc-500 sm:block">Acompanhe o desempenho do seu negócio.</p></div></div><div className="flex items-center gap-3"><Button asChild variant="outline" size="sm" className="hidden sm:inline-flex"><Link href="/" target="_blank" rel="noopener noreferrer">Ver loja <FiExternalLink /></Link></Button><Button variant="outline" size="icon" aria-label="Notificações" className="relative"><FiBell /><span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-[#b8ff5c]" /></Button></div></header>

        <main className="mx-auto max-w-[1580px] p-5 md:p-10 xl:p-12">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-sm text-zinc-500">Bem-vindo de volta, Pedro.</p><h2 className="display-title mt-1 text-3xl font-semibold md:text-4xl">Seu negócio está crescendo.</h2></div><div className="relative w-full sm:w-auto"><select aria-label="Período do relatório" value={period} onChange={(event) => setPeriod(event.target.value)} className="h-11 w-full appearance-none rounded-xl border border-[var(--control-border)] bg-[var(--control-surface)] pl-4 pr-10 text-xs font-bold text-[var(--control-text)] outline-none transition focus:border-[var(--control-focus)] focus:ring-2 focus:ring-[var(--control-focus)]/25 sm:w-auto"><option>Últimos 7 dias</option><option>Últimos 30 dias</option><option>Este ano</option></select><FiChevronDown className="pointer-events-none absolute right-3 top-3.5 text-[var(--control-muted)]" /></div></div>

          <section className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">{[
            { icon: FiDollarSign, label: "Receita líquida", value: "R$ 12.984", change: "+18,4%" },
            { icon: FiShoppingBag, label: "Vendas", value: "312", change: "+12,8%" },
            { icon: FiActivity, label: "Conversão", value: "4,82%", change: "+0,6%" },
            { icon: FiTrendingUp, label: "Ticket médio", value: "R$ 41,61", change: "+3,1%" },
          ].map(({ icon: Icon, label, value, change }) => <article key={label} className="card interactive-card p-6"><div className="flex items-start justify-between"><span className="icon-tile"><Icon /></span><Badge variant="success">{change}</Badge></div><p className="mt-8 text-xs font-semibold text-zinc-400">{label}</p><p className="mt-1 text-2xl font-black tracking-[-.03em] text-white">{value}</p></article>)}</section>

          <section className="mt-4 grid gap-4 xl:grid-cols-[1.55fr_.75fr]">
            <article className="overflow-hidden rounded-[24px] border border-white/[.08] bg-[#0d1119] p-5 md:p-6"><div className="flex items-start justify-between"><div><h3 className="font-bold">Receita</h3><p className="mt-1 text-xs text-zinc-400">Desempenho no período selecionado</p></div><Button variant="ghost" size="icon" aria-label="Mais opções de receita"><FiMoreHorizontal /></Button></div><div className="mt-8 flex items-end gap-3"><strong className="text-3xl">R$ 14.664</strong><Badge variant="success" className="mb-1">+18,4%</Badge></div><div className="mt-7 h-[230px] w-full"><svg viewBox="0 0 700 230" preserveAspectRatio="none" className="h-full w-full" role="img" aria-label="Gráfico de receita crescente"><defs><linearGradient id="dashboardChart" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#b8ff5c" stopOpacity=".28"/><stop offset="1" stopColor="#b8ff5c" stopOpacity="0"/></linearGradient></defs>{[30,80,130,180].map((y) => <line key={y} x1="0" x2="700" y1={y} y2={y} stroke="rgba(255,255,255,.06)" />)}<path d="M0 196 C50 188,68 160,112 169 S170 138,210 150 S275 102,315 119 S380 88,422 98 S480 53,528 72 S610 32,700 38 L700 230 L0 230 Z" fill="url(#dashboardChart)"/><path d="M0 196 C50 188,68 160,112 169 S170 138,210 150 S275 102,315 119 S380 88,422 98 S480 53,528 72 S610 32,700 38" fill="none" stroke="#b8ff5c" strokeWidth="3" strokeLinecap="round"/><circle cx="528" cy="72" r="6" fill="#070a10" stroke="#b8ff5c" strokeWidth="3" /></svg></div><div className="flex justify-between text-[10px] font-semibold text-zinc-500"><span>01 JUN</span><span>07 JUN</span><span>14 JUN</span><span>21 JUN</span><span>30 JUN</span></div></article>
            <article className="rounded-[24px] border border-white/[.08] bg-[#0d1119] p-5 md:p-6"><div className="flex items-start justify-between"><div><h3 className="font-bold">Meta mensal</h3><p className="mt-1 text-xs text-zinc-500">R$ 20.000 em receita</p></div><FiArrowUpRight className="text-zinc-600" /></div><div className="mx-auto mt-9 grid h-44 w-44 place-items-center rounded-full bg-[conic-gradient(#b8ff5c_0_73%,rgba(255,255,255,.06)_73%_100%)] p-3"><div className="grid h-full w-full place-items-center rounded-full bg-[#0d1119] text-center"><div><strong className="text-3xl">73%</strong><span className="mt-1 block text-xs text-zinc-500">alcançado</span></div></div></div><div className="mt-8 flex justify-between border-t border-white/[.07] pt-5 text-sm"><span className="text-zinc-500">Faltam</span><strong>R$ 5.336</strong></div></article>
          </section>

          <section className="mt-4 grid gap-4 xl:grid-cols-[1.45fr_.85fr]">
            <article className="min-w-0 overflow-hidden rounded-[24px] border border-white/[.08] bg-[#0d1119]"><div className="flex items-center justify-between border-b border-white/[.07] p-5 md:px-6"><div><h3 className="font-bold">Vendas recentes</h3><p className="mt-1 text-xs text-zinc-400">Últimas transações da sua loja</p></div><Button variant="ghost" size="sm">Ver todas</Button></div><div className="overflow-x-auto"><table className="w-full min-w-[620px] text-left"><thead><tr className="border-b border-white/[.06] text-[10px] uppercase tracking-wider text-zinc-400"><th className="px-6 py-4 font-bold">Cliente</th><th className="px-4 py-4 font-bold">Valor</th><th className="px-4 py-4 font-bold">Status</th><th className="px-6 py-4 text-right font-bold">Quando</th></tr></thead><tbody>{sales.map((sale) => <tr key={sale.email} className="border-b border-white/[.05] last:border-0"><td className="px-6 py-4"><strong className="block text-sm">{sale.customer}</strong><span className="mt-1 block text-xs text-zinc-400">{sale.email}</span></td><td className="px-4 py-4 text-sm font-bold">{sale.value}</td><td className="px-4 py-4"><Badge variant={sale.status === "Aprovado" ? "success" : "warning"}>{sale.status}</Badge></td><td className="px-6 py-4 text-right text-xs text-zinc-400">{sale.time}</td></tr>)}</tbody></table></div></article>
            <article className="min-w-0 rounded-[24px] border border-white/[.08] bg-[#0d1119] p-5 md:p-6"><div className="flex items-start justify-between"><div><h3 className="font-bold">Seu produto</h3><p className="mt-1 text-xs text-zinc-400">Desempenho individual</p></div><Button variant="ghost" size="icon" aria-label="Mais opções do produto"><FiMoreHorizontal /></Button></div><div className="mt-7 rounded-2xl border border-white/[.07] bg-white/[.025] p-4"><div className="flex items-start gap-3"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-blue-500/15 text-blue-200"><FiPackage /></span><div className="min-w-0"><strong className="block truncate text-sm">Tráfego Pago: do Zero à Escala</strong><Badge variant="success" className="mt-2">Produto ativo</Badge></div></div><div className="mt-5 grid grid-cols-2 gap-3 border-t border-white/[.07] pt-4"><div><span className="block text-[10px] font-bold uppercase text-zinc-400">Vendas</span><strong className="mt-1 block">312</strong></div><div><span className="block text-[10px] font-bold uppercase text-zinc-400">Receita</span><strong className="mt-1 block">R$ 14.664</strong></div></div></div><Button variant="outline" className="mt-4 w-full border-dashed"><FiPlus /> Novo produto</Button></article>
          </section>
        </main>
      </div>
    </div>
  );
}
