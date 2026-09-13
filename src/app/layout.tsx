import type { Metadata } from "next";
import { Outfit, Zen_Maru_Gothic } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["500", "700", "800"],
});

const zenMaru = Zen_Maru_Gothic({
  subsets: ["latin"],
  variable: "--font-zen",
  weight: ["500", "700", "900"],
});

export const metadata: Metadata = {
  title: "Game for 2",
  description: "2人で遊べるミニゲーム集",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${outfit.variable} ${zenMaru.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
