import type { ReactNode } from "react";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { getDefaultProduct, getProductPath } from "@/lib/catalog";

export default function BlogLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header productHref={getProductPath(getDefaultProduct())} />
      <main>{children}</main>
      <Footer />
    </>
  );
}
