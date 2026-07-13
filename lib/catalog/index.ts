import { products } from "./products";
import type { Product } from "./types";

export * from "./categories";
export * from "./types";

export function getPublishedProducts(): Product[] {
  return products.filter((product) => product.status === "published");
}

export function getFeaturedProducts(): Product[] {
  return getPublishedProducts().filter((product) => product.featured);
}

export function getProductBySlug(slug: string): Product | undefined {
  return getPublishedProducts().find((product) => product.slug === slug);
}

export function getDefaultProduct(): Product {
  const product = getFeaturedProducts()[0] ?? getPublishedProducts()[0];
  if (!product) throw new Error("O catálogo precisa ter pelo menos um produto publicado.");
  return product;
}

export function getProductPath(product: Pick<Product, "slug">): string {
  return `/products/${product.slug}`;
}

export function formatProductPrice(product: Pick<Product, "price" | "currency">): string {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: product.currency }).format(product.price);
}

export function getProductFromCheckoutParam(value: string | string[] | undefined): Product {
  const slug = Array.isArray(value) ? value[0] : value;
  return (slug && getProductBySlug(slug)) || getDefaultProduct();
}
