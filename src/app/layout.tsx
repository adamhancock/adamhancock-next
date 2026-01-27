import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { SocialDock } from "@/components/social-dock";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Adam Hancock | Platform Lead",
    template: "%s | Adam Hancock",
  },
  description: "Developer with a passion for DevOps, Cloud Computing and Automation. Building scalable infrastructure and empowering teams to ship faster.",
  keywords: ["DevOps", "Kubernetes", "Cloud Computing", "Platform Engineering", "TypeScript", "Infrastructure"],
  authors: [{ name: "Adam Hancock", url: "https://adamhancock.co.uk" }],
  creator: "Adam Hancock",
  metadataBase: new URL("https://adamhancock.co.uk"),
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://adamhancock.co.uk",
    siteName: "Adam Hancock",
    title: "Adam Hancock | Platform Lead",
    description: "Developer with a passion for DevOps, Cloud Computing and Automation.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Adam Hancock - Platform Lead",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Adam Hancock | Platform Lead",
    description: "Developer with a passion for DevOps, Cloud Computing and Automation.",
    creator: "@adamhancock",
    images: ["/og-image.png"],
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
  verification: {
    // Add your verification codes here
    // google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background`}>
        <Header />
        <main className="container py-8 pb-24">
          {children}
        </main>
        <SocialDock />
      </body>
    </html>
  );
}
