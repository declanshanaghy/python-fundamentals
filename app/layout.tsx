import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Computing from First Principles",
  description: "A concept-first programming course: understand how computers work, then learn to program them.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  openGraph: {
    title: "Computing from First Principles",
    description: "How can 0 and 1 make all of this? Begin with the physical machine and climb the abstraction ladder to Python.",
    images: [{ url: "/og.png", width: 1536, height: 1024, alt: "Computing from First Principles — from signals to abstraction layers" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Computing from First Principles",
    description: "How can 0 and 1 make all of this?",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body></html>;
}
