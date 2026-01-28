import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { OpenPanelComponent } from "@openpanel/nextjs";

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
    default: "Adam Hancock | Founding Engineer",
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
    title: "Adam Hancock | Founding Engineer",
    description: "Developer with a passion for DevOps, Cloud Computing and Automation.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Adam Hancock - Founding Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Adam Hancock | Founding Engineer",
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
        <OpenPanelComponent
          clientId="9952441b-de50-4420-b9a6-0c62f04eba9d"
          apiUrl="https://adamhancock.co.uk/ingest"
          trackScreenViews={true}
          trackOutgoingLinks={true}
        />
        <Header />
        <main className="container px-4 md:px-8 py-4 md:py-8 pb-8 md:pb-24">
          {children}
        </main>
      </body>
    </html>
  );
}
