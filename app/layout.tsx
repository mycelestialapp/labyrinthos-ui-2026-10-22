import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import BottomNav from "../components/BottomNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "迷宫坛 · 星云",
  description: "月相、星象与灵知界面",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* min-h-[100dvh] + min-w-0：避免主列在 flex 下高度塌成 0 看起来像「整页白板」 */}
        <div className="flex min-h-[100dvh] min-w-0 flex-1 flex-col">{children}</div>
        <BottomNav />
      </body>
    </html>
  );
}
