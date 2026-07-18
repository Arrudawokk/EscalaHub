import type { Metadata, Viewport } from "next";
import { Analytics } from "@/components/analytics/Analytics";
import { SITE_URL, siteConfig } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: siteConfig.title, template: "%s | EscalaHub" },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  manifest: "/site.webmanifest",
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
    images: [{ url: "/brand/logo.png", width: 1536, height: 1024, alt: "Logo oficial da EscalaHub" }],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: [{ url: "/brand/logo.png", alt: "Logo oficial da EscalaHub" }],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: ["/favicon.ico"],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  appleWebApp: { capable: true, title: siteConfig.name, statusBarStyle: "black-translucent" },
  other: { "msapplication-TileColor": "#071008", "msapplication-TileImage": "/mstile-150x150.png" },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#071008", colorScheme: "dark" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const sameAs = Object.values(siteConfig.social).filter((url): url is string => Boolean(url));
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: siteConfig.name,
    url: SITE_URL,
    logo: `${SITE_URL}/brand/logo.png`,
    description: siteConfig.description,
    email: siteConfig.contactEmail,
    sameAs,
  };

  return (
    <html lang={siteConfig.language} className="dark" data-scroll-behavior="smooth">
      <body>
        {children}
        <Analytics />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema).replace(/</g, "\\u003c") }} />
      </body>
    </html>
  );
}
