export type ArticleStatus = "draft" | "published" | "archived";

export type ArticleAuthor = {
  id: string;
  name: string;
  role: string;
  bio: string;
};

export type ArticleSection = {
  id: string;
  title: string;
  paragraphs: string[];
  bullets?: string[];
  callout?: string;
};

export type Article = {
  slug: string;
  title: string;
  description: string;
  excerpt: string;
  category: string;
  authorId: string;
  publishedAt: string;
  updatedAt: string;
  keywords: string[];
  featured: boolean;
  status: ArticleStatus;
  sections: ArticleSection[];
};
