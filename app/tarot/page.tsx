"use client";

/**
 * 从星云等处的 `<Link href="/tarot">` 会走 RSC：middleware 不能喂静态整页，否则白屏。
 * 此处用同源 iframe 加载 `public/tarot-master.html`，地址栏仍为 `/tarot`。
 * 直接地址栏打开 `/tarot` 时 middleware 对文档请求 rewrite 静态页，本组件通常不会挂载。
 */
export default function TarotPage() {
  return (
    <iframe
      title="圣域塔罗 · 大师版"
      src="/tarot-master.html"
      className="fixed inset-0 z-0 block h-[100dvh] w-full border-0 bg-[#0b0510]"
    />
  );
}
