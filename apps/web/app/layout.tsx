import "./globals.css";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import { SiteHeader } from "@/components/site-header";
import type { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CircleCast",
  description:
    "AI-powered micro-community voice networks for creators and specialists."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} flex min-h-screen flex-col bg-white`}>
        <div className="noise" aria-hidden="true" />
        <Providers>
          <SiteHeader />
          <main className="flex-1">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
