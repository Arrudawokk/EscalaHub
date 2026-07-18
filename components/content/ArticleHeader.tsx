import Link from "next/link";
import { FiChevronRight, FiClock } from "react-icons/fi";
import { Badge } from "@/components/ui/Badge";
import { formatArticleDate, getArticleReadingTime, type Article, type ArticleAuthor } from "@/content/articles";

export function ArticleHeader({ article, author }: { article: Article; author: ArticleAuthor }) {
  return (
    <header className="noise relative overflow-hidden border-b border-white/[.06] pb-16 pt-[116px] sm:pb-20 sm:pt-[132px]">
      <div className="premium-grid pointer-events-none absolute inset-0 opacity-55" />
      <div className="pointer-events-none absolute left-[-12rem] top-[-16rem] h-[38rem] w-[38rem] rounded-full bg-blue-600/[.12] blur-[150px]" />
      <div className="container-default relative">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs font-semibold text-zinc-500">
          <Link href="/" className="rounded py-2 outline-none transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-[#3B82F6]">Início</Link>
          <FiChevronRight aria-hidden="true" />
          <Link href="/blog" className="rounded py-2 outline-none transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-[#3B82F6]">Blog</Link>
          <FiChevronRight aria-hidden="true" />
          <span className="text-zinc-300" aria-current="page">{article.category}</span>
        </nav>
        <div className="mt-8 max-w-4xl">
          <div className="flex flex-wrap gap-2"><Badge variant="info">{article.category}</Badge><Badge variant="success">Atualizado recentemente</Badge></div>
          <h1 className="display-title mt-6 text-[clamp(2.9rem,7vw,5.7rem)] font-semibold leading-[.96] text-white">{article.title}</h1>
          <p className="mt-7 max-w-3xl text-lg leading-8 text-zinc-300 sm:text-xl sm:leading-9">{article.description}</p>
          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-zinc-400">
            <span>Por <strong className="text-white">{author.name}</strong></span>
            <span>Atualizado em {formatArticleDate(article.updatedAt)}</span>
            <span className="flex items-center gap-1.5"><FiClock aria-hidden="true" /> {getArticleReadingTime(article)} min de leitura</span>
          </div>
        </div>
      </div>
    </header>
  );
}
