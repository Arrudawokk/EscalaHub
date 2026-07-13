import type { ProductCategory } from "./types";

export const productCategories = [
  { slug: "marketing", name: "Marketing", description: "Aquisição, conteúdo, mídia e crescimento." },
  { slug: "ia", name: "IA", description: "Inteligência artificial aplicada ao trabalho e aos negócios." },
  { slug: "negocios", name: "Negócios", description: "Estratégia, gestão, vendas e operação." },
  { slug: "produtividade", name: "Produtividade", description: "Métodos para executar melhor e ganhar tempo." },
  { slug: "design", name: "Design", description: "Criação visual, produto e comunicação." },
  { slug: "automacao", name: "Automação", description: "Processos, integrações e eficiência operacional." },
] as const satisfies readonly ProductCategory[];

export function getCategoryBySlug(slug: ProductCategory["slug"]) {
  return productCategories.find((category) => category.slug === slug);
}
