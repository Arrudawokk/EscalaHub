import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Gestão de vendas, produtos e clientes da EscalaHub.",
  alternates: { canonical: "/dashboard" },
  robots: { index: false, follow: false },
};

export default function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
