import Link from "next/link";
import { FiMail } from "react-icons/fi";
import { siteConfig } from "@/lib/site";

const footerGroups = [
  { title: "Explorar", links: [{ label: "Produtos", href: "/#produto" }, { label: "Blog", href: "/blog" }] },
  { title: "EscalaHub", links: [{ label: "Sobre", href: "/sobre" }, { label: "Contato", href: "/contato" }] },
  { title: "Legal", links: [{ label: "Privacidade", href: "/privacidade" }, { label: "Termos", href: "/termos" }, { label: "Cookies", href: "/cookies" }, { label: "LGPD", href: "/LGPD" }] },
];

export function Footer() {
  return (
    <footer className="border-t border-white/[.06] bg-[#090c12] pb-9 pt-14">
      <div className="container-default">
        <div className="grid gap-12 border-b border-white/[.07] pb-14 md:grid-cols-[1.2fr_.8fr_.8fr_.8fr]">
          <div className="max-w-sm">
            <Link href="/" aria-label="EscalaHub — início" className="inline-flex min-h-11 items-center gap-3 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-blue-400"><span aria-hidden="true" className="brand-mark">E</span><span className="brand-wordmark">EscalaHub</span></Link>
            <p className="mt-4 text-sm leading-6 text-zinc-500">Produtos digitais e conteúdo prático para aprender, decidir e aplicar com método.</p>
            <a href={`mailto:${siteConfig.contactEmail}`} className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-lg py-2 text-sm font-semibold text-zinc-300 outline-none hover:text-white focus-visible:ring-2 focus-visible:ring-blue-400"><FiMail aria-hidden="true" /> {siteConfig.contactEmail}</a>
          </div>
          {footerGroups.map((group) => (
            <nav key={group.title} aria-label={group.title}>
              <p className="text-[10px] font-black uppercase tracking-[.15em] text-zinc-500">{group.title}</p>
              <ul className="mt-4 space-y-1">{group.links.map((link) => <li key={link.href}><Link href={link.href} className="inline-flex min-h-10 items-center rounded px-1 text-sm text-zinc-400 outline-none transition hover:text-white focus-visible:ring-2 focus-visible:ring-blue-400">{link.label}</Link></li>)}</ul>
            </nav>
          ))}
        </div>
        <div className="flex flex-col justify-between gap-3 pt-7 text-xs text-zinc-600 sm:flex-row"><p>© {new Date().getFullYear()} EscalaHub. Todos os direitos reservados.</p><p>Conteúdo responsável. Produtos digitais transparentes.</p></div>
      </div>
    </footer>
  );
}
