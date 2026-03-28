import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "神秘宇宙罗盘 · 迷宫坛",
  description: "神秘宇宙罗盘",
};

export default function CompassPage() {
  return (
    <div className="relative min-h-dvh w-full bg-transparent">
      <iframe
        src="/index.html"
        title="神秘宇宙羅盤"
        className="absolute inset-0 h-full w-full border-0"
        allow="fullscreen"
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </div>
  );
}
