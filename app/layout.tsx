import type { Metadata } from "next";
import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://sbfindex.com";
const OG_IMAGE = `${SITE_URL}/og-image.png`;

export const metadata: Metadata = {
  title: "SBF Index — The Ghost Portfolio",
  description:
    "Sam Bankman-Fried would be worth $100 billion today if the FTX estate had held his book. A live tracker of every position sold too early.",
  metadataBase: new URL(SITE_URL),
  openGraph: {
    title: "SBF Index — The Ghost Portfolio",
    description:
      "Sam Bankman-Fried would be worth $100 billion today if the FTX estate had held his book. A live tracker of every position sold too early.",
    url: SITE_URL,
    siteName: "SBF Index",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "SBF Index — The Ghost Portfolio",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SBF Index — The Ghost Portfolio",
    description:
      "Sam Bankman-Fried would be worth $100 billion today if the FTX estate had held his book.",
    images: [OG_IMAGE],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Inter:wght@300;400;500;600&family=Source+Serif+4:opsz,wght@8..60,300..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
