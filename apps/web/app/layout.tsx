import type { Metadata } from "next";
import localFont from "next/font/local";
import "@notpadd/ui/styles/globals.css";
import Providers from "@/components/providers";
import { siteConfig } from "@/lib/site";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: ` %s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  keywords: [
    "Portofio",
    "Interactive",
    "Frontend Developer",
    "Developer in Africa",
    "Developer in Cameroon",
    "React",
    "Tailwind CSS",
    "Framer motion",
    "Animation",
    "Bossadi",
    "Zenith",
    "Nothing",
  ],
  creator: siteConfig.links.author,
  authors: [
    {
      name: siteConfig.links.author,
      url: siteConfig.links.authorSite,
    },
  ],
  icons: {
    icon: [
      { url: "/notpadd-light.png", media: "(prefers-color-scheme: dark)" },
      { url: "/notpadd-dark.png", media: "(prefers-color-scheme: light)" },
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
    creator: "@bossadizenith",
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
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

// <motion.div
//   className="absolute left-[-50%] top-[-50%] h-[200%] w-[200%] bg-[conic-gradient(from_0deg,transparent_0%,#4DAFFE_10%,#4DAFFE_25%,transparent_35%)]"
//   animate={{ rotate: 360 }}
//   transition={{
//     duration: 1.25,
//     repeat: Infinity,
//     ease: "linear",
//     repeatType: "loop",
//   }}
// />;
