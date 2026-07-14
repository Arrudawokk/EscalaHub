import type { Metadata, Viewport } from "next";
import { Analytics } from "@/components/analytics/Analytics";
import { SITE_URL, siteConfig } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: siteConfig.title, template: "%s | EscalaHub" },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  manifest: "/manifest.webmanifest",
  keywords: ["produtos digitais", "infoprodutos", "tráfego pago", "marketing digital", "Meta Ads", "Google Ads", "TikTok Ads", "e-book", "EscalaHub"],
  authors: [{ name: siteConfig.name, url: SITE_URL }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  category: "education",
  classification: "Produtos digitais e educação profissional",
  alternates: { canonical: "/" },
  referrer: "strict-origin-when-cross-origin",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    url: "/",
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "EscalaHub — Conhecimento que vira resultado" }],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: [{ url: "/twitter-image", alt: "EscalaHub — Conhecimento que vira resultado" }],
  },
  icons: { icon: "/icon.svg", shortcut: "/icon.svg", apple: "/apple-icon" },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#06080d", colorScheme: "dark" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const sameAs = Object.values(siteConfig.social).filter((url): url is string => Boolean(url));
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: siteConfig.name,
    url: SITE_URL,
    logo: `${SITE_URL}/icon.svg`,
    description: siteConfig.description,
    email: siteConfig.contactEmail,
    sameAs,
  };

  return (
    <html lang={siteConfig.language} className="dark">
      <body>
        {children}
        <Analytics />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema).replace(/</g, "\\u003c") }} />
      </body>
    </html>
  );
}
