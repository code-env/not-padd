import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@notpadd/ui/styles/globals.css";
import { ThemeProvider } from "@/components/theme";
import { siteConfig } from "@notpadd/ui/lib/utils";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mon0",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.name + " - Docs",
    template: ` %s | ${siteConfig.name + " - Docs"}`,
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  keywords: siteConfig.keywords,
  creator: siteConfig.links.author.username,
  authors: [
    {
      name: siteConfig.links.author.name,
      url: siteConfig.links.authorSite,
    },
  ],
  icons: {
    icon: [
      { url: "/dark.png", media: "(prefers-color-scheme: dark)" },
      { url: "/light.png", media: "(prefers-color-scheme: light)" },
    ],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: `@${siteConfig.links.author.username}`,
  },
  manifest: `${siteConfig.url}/site.webmanifest`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-geist-mono`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
