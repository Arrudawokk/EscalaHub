import type { ArticleSection } from "@/content/articles";

export function TableOfContents({ sections }: { sections: ArticleSection[] }) {
  return (
    <nav aria-label="Sumário do artigo" className="surface-panel p-5">
      <p className="text-[10px] font-black uppercase tracking-[.15em] text-[#b8ff5c]">Neste artigo</p>
      <ol className="mt-4 space-y-1">
        {sections.map((section, index) => (
          <li key={section.id}>
            <a href={`#${section.id}`} className="flex min-h-10 items-start gap-3 rounded-lg px-2 py-2 text-sm leading-5 text-zinc-400 outline-none transition-colors hover:bg-white/[.04] hover:text-white focus-visible:ring-2 focus-visible:ring-blue-400">
              <span className="font-mono text-[10px] font-bold text-zinc-600">{String(index + 1).padStart(2, "0")}</span>
              <span>{section.title}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
