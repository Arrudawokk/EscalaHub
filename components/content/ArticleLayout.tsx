import { FiCheck } from "react-icons/fi";
import { SITE_URL } from "@/lib/site";
import { getArticlePath, type Article, type ArticleAuthor } from "@/content/articles";
import { ArticleClientEnhancements } from "./ArticleClientEnhancements";
import { AuthorBox } from "./AuthorBox";
import { ShareButtons } from "./ShareButtons";
import { TableOfContents } from "./TableOfContents";

export function ArticleLayout({ article, author }: { article: Article; author: ArticleAuthor }) {
  return (
    <>
      <ArticleClientEnhancements />
      <div className="container-default grid gap-10 py-14 lg:grid-cols-[260px_minmax(0,760px)] lg:justify-center lg:gap-16 lg:py-20">
        <aside className="lg:sticky lg:top-24 lg:h-fit"><TableOfContents sections={article.sections} /></aside>
        <article className="min-w-0">
          <div className="space-y-14">
            {article.sections.map((section) => (
              <section key={section.id} id={section.id} aria-labelledby={`${section.id}-title`}>
                <h2 id={`${section.id}-title`} className="display-title text-3xl font-semibold leading-tight text-white sm:text-4xl">{section.title}</h2>
                <div className="mt-6 space-y-5 text-[17px] leading-8 text-zinc-300">
                  {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                </div>
                {section.bullets ? (
                  <ul className="mt-6 space-y-3 rounded-[22px] border border-white/[.08] bg-white/[.025] p-5 sm:p-6">
                    {section.bullets.map((bullet) => <li key={bullet} className="flex gap-3 leading-7 text-zinc-300"><FiCheck className="mt-1.5 shrink-0 text-[#b8ff5c]" aria-hidden="true" /><span>{bullet}</span></li>)}
                  </ul>
                ) : null}
                {section.callout ? <blockquote className="mt-7 rounded-r-2xl border-l-2 border-[#b8ff5c] bg-[#b8ff5c]/[.055] px-5 py-5 text-lg font-semibold leading-8 text-zinc-200 sm:px-6">{section.callout}</blockquote> : null}
              </section>
            ))}
          </div>
          <div className="mt-16 space-y-7">
            <ShareButtons title={article.title} url={`${SITE_URL}${getArticlePath(article)}`} />
            <AuthorBox author={author} />
          </div>
        </article>
      </div>
    </>
  );
}
