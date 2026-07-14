import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Minha conta",
  description: "Acesse seus produtos digitais e pedidos da EscalaHub.",
  robots: { index: false, follow: false },
};

export default function AccountLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
