import type { ArticleAuthor } from "./types";

export const articleAuthors = [
  {
    id: "equipe-escalahub",
    name: "Equipe EscalaHub",
    role: "Curadoria editorial",
    bio: "Conteúdo prático sobre marketing, negócios e tecnologia, revisado para privilegiar clareza, aplicação e decisões responsáveis.",
  },
] as const satisfies readonly ArticleAuthor[];

export function getArticleAuthor(id: string): ArticleAuthor | undefined {
  return articleAuthors.find((author) => author.id === id);
}
