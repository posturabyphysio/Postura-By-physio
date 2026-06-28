import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import NextTopLoader from "nextjs-toploader";
import { Navbar } from "../components/Home/Navbar";
import { ChatWidget } from "../components/Chatbot/ChatWidget";
import { GoogleAnalytics } from "../components/GoogleAnalytics";
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_KEYWORDS,
  SITE_NAME,
  SITE_URL,
} from "../lib/seo";

const switzer = localFont({
  src: [
    {
      path: "../public/fonts/Switzer-Variable.ttf",
      style: "normal",
    },
    {
      path: "../public/fonts/Switzer-VariableItalic.ttf",
      style: "italic",
    },
  ],
  variable: "--font-switzer",
  display: "swap",
});

const cabinetGrotesk = localFont({
  src: "../public/fonts/CabinetGrotesk-Variable.ttf",
  variable: "--font-cabinet",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  keywords: DEFAULT_KEYWORDS,
  authors: [{ name: "Dr. Priyanshi Pandya" }],
  creator: SITE_NAME,
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    images: [
      {
        url: "/about-hero.png",
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    images: ["/about-hero.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  ...(process.env.GOOGLE_SITE_VERIFICATION && {
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
    },
  }),
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png" },
    ],
    apple: "/favicon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${switzer.variable} ${cabinetGrotesk.variable} font-switzer`}
      >
        <GoogleAnalytics />
        <NextTopLoader color="#008080" showSpinner={false} />
        <Navbar />
        <main>{children}</main>
        <ChatWidget />
      </body>
    </html>
  );
}
