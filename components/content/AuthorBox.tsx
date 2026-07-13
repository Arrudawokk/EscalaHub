import { FiEdit3, FiShield } from "react-icons/fi";
import type { ArticleAuthor } from "@/content/articles";

export function AuthorBox({ author }: { author: ArticleAuthor }) {
  return (
    <aside className="card p-6 sm:p-7" aria-label="Sobre o autor">
      <div className="flex items-start gap-4">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#b8ff5c] text-lg font-black text-[#071008]" aria-hidden="true">E</span>
        <div>
          <p className="text-xs font-bold uppercase tracking-[.12em] text-zinc-500">Sobre o autor</p>
          <h2 className="mt-2 text-lg font-bold text-white">{author.name}</h2>
          <p className="mt-1 text-sm font-semibold text-[#b8ff5c]">{author.role}</p>
        </div>
      </div>
      <p className="mt-5 leading-7 text-zinc-400">{author.bio}</p>
      <div className="mt-5 flex flex-wrap gap-4 border-t border-white/[.07] pt-4 text-xs font-semibold text-zinc-500">
        <span className="flex items-center gap-1.5"><FiEdit3 aria-hidden="true" /> Conteúdo revisado</span>
        <span className="flex items-center gap-1.5"><FiShield aria-hidden="true" /> Sem promessas enganosas</span>
      </div>
    </aside>
  );
}
