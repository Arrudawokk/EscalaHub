import Link from "next/link";
import { FiArrowUpRight, FiClock } from "react-icons/fi";
import { Badge } from "@/components/ui/Badge";
import { formatArticleDate, getArticlePath, getArticleReadingTime, type Article } from "@/content/articles";

export function ArticleCard({ article, featured = false }: { article: Article; featured?: boolean }) {
  return (
    <article className={`card interactive-card flex h-full flex-col rounded-[26px] p-7 sm:p-8 ${featured ? "md:p-10" : ""}`}>
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="info">{article.category}</Badge>
        {article.updatedAt === article.publishedAt ? <Badge variant="neutral">Publicado recentemente</Badge> : <Badge variant="success">Atualizado recentemente</Badge>}
      </div>
      <h2 className={`display-title mt-6 font-semibold leading-[1.05] text-white ${featured ? "text-3xl sm:text-4xl" : "text-2xl"}`}>
        <Link href={getArticlePath(article)} className="rounded-lg outline-none transition-colors hover:text-[#b8ff5c] focus-visible:ring-2 focus-visible:ring-[#3B82F6]">
          {article.title}
        </Link>
      </h2>
      <p className="mt-4 flex-1 leading-7 text-zinc-400">{article.excerpt}</p>
      <div className="mt-7 flex flex-wrap items-center justify-between gap-4 border-t border-white/[.08] pt-5 text-xs text-zinc-500">
        <span>{formatArticleDate(article.updatedAt)}</span>
        <span className="flex items-center gap-1.5"><FiClock aria-hidden="true" /> {getArticleReadingTime(article)} min de leitura</span>
      </div>
      <Link href={getArticlePath(article)} className="mt-6 inline-flex min-h-11 items-center gap-2 self-start rounded-lg py-2 text-sm font-bold text-[#b8ff5c] outline-none transition-[gap,color] hover:gap-3 hover:text-[#d9ffab] focus-visible:ring-2 focus-visible:ring-[#3B82F6]">
        Ler artigo <FiArrowUpRight aria-hidden="true" />
      </Link>
    </article>
  );
}
