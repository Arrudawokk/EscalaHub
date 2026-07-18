import Link from "next/link";
import { FiBookOpen, FiClipboard, FiHome, FiLogOut, FiUser } from "react-icons/fi";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { Button } from "@/components/ui/Button";
import type { CustomerProfile } from "@/lib/account/types";
import { logoutAccount } from "@/app/account/actions";

const navigation = [
  { href: "/account", label: "Visão geral", icon: FiHome },
  { href: "/account/meus-produtos", label: "Meus produtos", icon: FiBookOpen },
  { href: "/account/pedidos", label: "Pedidos", icon: FiClipboard },
  { href: "/account/perfil", label: "Perfil", icon: FiUser },
];

export function AccountShell({ profile, children }: { profile: CustomerProfile; children: React.ReactNode }) {
  const initials = (profile.name || profile.email).split(/\s|@/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("");
  return (
    <div className="min-h-screen bg-[#070a10] text-white">
      <div className="premium-grid pointer-events-none fixed inset-0 opacity-25" />
      <header className="relative border-b border-white/[.07] bg-[#080b11]/90 backdrop-blur-xl">
        <div className="container-default flex min-h-20 items-center justify-between gap-4">
          <Link href="/" className="flex min-h-11 items-center rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6]" aria-label="EscalaHub — início"><BrandLogo /></Link>
          <div className="flex min-w-0 items-center gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#b8ff5c]/15 text-xs font-black text-[#b8ff5c]">{initials}</span><span className="hidden min-w-0 sm:block"><strong className="block max-w-48 truncate text-sm">{profile.name || "Cliente EscalaHub"}</strong><span className="block max-w-48 truncate text-xs text-zinc-500">{profile.email}</span></span></div>
        </div>
      </header>
      <div className="container-default relative grid gap-8 py-8 lg:grid-cols-[230px_minmax(0,1fr)] lg:py-12">
        <aside className="lg:sticky lg:top-8 lg:self-start">
          <nav aria-label="Área do cliente" className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-1">
            {navigation.map(({ href, label, icon: Icon }) => <Button key={href} asChild variant="ghost" className="h-auto min-h-11 justify-start rounded-xl px-3 py-2.5"><Link href={href}><Icon aria-hidden="true" />{label}</Link></Button>)}
          </nav>
          <form action={logoutAccount} className="mt-3 border-t border-white/[.07] pt-3"><Button type="submit" variant="ghost" className="w-full justify-start rounded-xl text-zinc-400"><FiLogOut aria-hidden="true" />Sair</Button></form>
        </aside>
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
