"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Star, ShoppingBag, Wand2 } from "lucide-react";
import { Playfair_Display } from "next/font/google";
import StarBackdrop from "../../components/StarBackdrop";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

type Product = {
  id: string;
  name: string;
  description: string;
  price: string;
  icon: React.ReactNode;
};

const PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "金线塔罗牌组",
    description: "织入金线的塔罗套组，适合深度内观。",
    price: "¥48",
    icon: <Sparkles className="h-6 w-6" />,
  },
  {
    id: "p2",
    name: "星象护符",
    description: "凝练符号，趋向安定与确信。",
    price: "¥36",
    icon: <Star className="h-6 w-6" />,
  },
  {
    id: "p3",
    name: "星云印杖",
    description: "极简手杖，承载意念与专注。",
    price: "¥22",
    icon: <Wand2 className="h-6 w-6" />,
  },
  {
    id: "p4",
    name: "玄典能量瓶",
    description: "微光仪式瓶，握感中有细碎的亮。",
    price: "¥18",
    icon: <Sparkles className="h-6 w-6" />,
  },
  {
    id: "p5",
    name: "星轨小饰",
    description: "床头与静隅皆宜的微型遗珍。",
    price: "¥14",
    icon: <Star className="h-6 w-6" />,
  },
  {
    id: "p6",
    name: "金辉手账",
    description: "封面柔光，书写你的路径。",
    price: "¥16",
    icon: <ShoppingBag className="h-6 w-6" />,
  },
];

function ProductCard({ p, idx }: { p: Product; idx: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 18, filter: "blur(10px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ delay: 0.06 + idx * 0.06, duration: 0.75, ease: "easeOut" }}
      whileHover={{
        y: -10,
        boxShadow: "0 0 0 1px rgba(252,246,186,0.22), 0 30px 90px rgba(0,0,0,0.50)",
      }}
      className="group relative overflow-hidden rounded-3xl border border-[#bf953f]/15 bg-white/5 backdrop-blur-md p-6"
      style={{ borderColor: "rgba(191,149,63,0.18)" }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(circle at 20% 10%, rgba(252,246,186,0.22) 0%, rgba(191,149,63,0.08) 55%, rgba(191,149,63,0) 70%)",
        }}
      />

      <div className="relative z-10 flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#bf953f]/20 bg-white/5 backdrop-blur-md">
            <div style={{ filter: "drop-shadow(0 0 12px rgba(191,149,63,0.22))" }}>{p.icon}</div>
          </div>
          <div className="text-right">
            <div className="text-[11px] tracking-[0.22em] text-zinc-400">标价</div>
            <div className="mt-1 text-lg tracking-[0.06em] text-zinc-100">{p.price}</div>
          </div>
        </div>

        <div>
          <div className={`${playfair.className} text-xl font-semibold tracking-[0.18em] text-zinc-100`}>
            {p.name}
          </div>
          <p className="mt-2 text-sm leading-relaxed text-zinc-300">{p.description}</p>
        </div>

        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="mt-auto relative overflow-hidden rounded-full border border-[#bf953f]/30 bg-white/5 px-4 py-3 text-sm tracking-[0.12em] text-[#fcf6ba]/90 backdrop-blur-md"
          style={{
            boxShadow: "0 0 0 1px rgba(191,149,63,0.10), 0 20px 70px rgba(0,0,0,0.35)",
          }}
        >
          <span className="relative z-10">加入能量之袋</span>
          <motion.span
            aria-hidden="true"
            className="absolute inset-0 rounded-full"
            style={{
              background:
                "linear-gradient(90deg, rgba(252,246,186,0) 0%, rgba(252,246,186,0.18) 45%, rgba(191,149,63,0.10) 55%, rgba(252,246,186,0) 100%)",
            }}
            initial={{ x: "-120%" }}
            whileHover={{ x: "120%" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          />
        </motion.button>
      </div>
    </motion.article>
  );
}

export default function ArcanaPage() {
  return (
    <StarBackdrop>
      <main className="relative min-h-screen w-full overflow-x-hidden text-zinc-100">
        <div className="relative z-10 mx-auto w-full max-w-6xl px-6 py-20">
          <div className="flex flex-col items-center text-center">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-[#bf953f]/25 bg-white/5 backdrop-blur-md px-4 py-2">
              <ShoppingBag className="h-4 w-4 text-[#fcf6ba]/90" />
              <span className="text-[11px] tracking-[0.22em] text-zinc-300">ARCANA ENERGY STORE</span>
            </div>

            <h1
              className={`${playfair.className} mt-8 text-4xl md:text-6xl font-semibold tracking-[0.18em]`}
              style={{ letterSpacing: "0.18em" }}
            >
              玄典
            </h1>

            <p className="mt-5 max-w-2xl text-sm md:text-base tracking-[0.28em] text-zinc-400 font-light">
              为日常仪式而备的器物，微光与重量皆在。
            </p>
          </div>

          {/* 商品列表：奢侈品官网质感（朦胧微光 + 悬停外发光） */}
          <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2">
            {PRODUCTS.map((p, idx) => (
              <ProductCard key={p.id} p={p} idx={idx} />
            ))}
          </div>
        </div>
      </main>
    </StarBackdrop>
  );
}

