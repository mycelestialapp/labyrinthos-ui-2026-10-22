"use client";

import React from "react";
import { motion } from "framer-motion";
import { Heart, Sparkles, Users } from "lucide-react";
import { Playfair_Display } from "next/font/google";
import StarBackdrop from "../../components/StarBackdrop";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

type Post = {
  id: string;
  author: string;
  avatarHint: string;
  time: string;
  content: string;
  tags: string[];
};

const POSTS: Post[] = [
  {
    id: "1",
    author: "星霧私语",
    avatarHint: "S",
    time: "刚刚",
    content:
      "今天的直觉更清晰了。仿佛宇宙在耳边写下一条温柔的指令。愿你也听见那份光。",
    tags: ["直觉", "柔信号"],
  },
  {
    id: "2",
    author: "月宫来客",
    avatarHint: "M",
    time: "2 小时前",
    content:
      "把恐惧交给时间，把行动交给呼吸。你走的每一步都在点亮你自己。",
    tags: ["行动", "呼吸"],
  },
  {
    id: "3",
    author: "金线旅者",
    avatarHint: "G",
    time: "昨天",
    content:
      "缘起不是偶然，是宇宙替你保留的回声。今天愿你收到一份属于你的答案。",
    tags: ["缘起", "回声"],
  },
  {
    id: "4",
    author: "静默占卜师",
    avatarHint: "A",
    time: "3 天前",
    content:
      "当你选择诚实，能量就会变得更稳定。让自己慢慢靠近真正的渴望。",
    tags: ["真实", "能量"],
  },
];

function DiaryCard() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18, filter: "blur(12px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.85, ease: "easeOut" }}
      className="rounded-3xl border border-[#bf953f]/15 bg-white/5 backdrop-blur-md p-6 md:p-8"
    >
      <div className="inline-flex items-center gap-2 rounded-full border border-[#bf953f]/25 bg-white/5 backdrop-blur-md px-4 py-2">
        <Sparkles className="h-4 w-4 text-[#fcf6ba]/90" />
        <span className="text-[11px] tracking-[0.22em] text-zinc-300">私域微光日记</span>
      </div>

      <h2
        className={`${playfair.className} mt-5 text-2xl md:text-3xl font-semibold tracking-[0.22em]`}
        style={{ letterSpacing: "0.2em" }}
      >
        缘起
      </h2>

      <p className="mt-4 text-sm md:text-base tracking-[0.28em] text-zinc-400 font-light leading-relaxed">
        写给内心的、带微光的私人手记。
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {[
          { label: "心笺", value: "温柔而清明" },
          { label: "社交气场", value: "温暖共振" },
        ].map((x, idx) => (
          <motion.div
            key={x.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 * idx }}
            className="relative overflow-hidden rounded-2xl border border-[#bf953f]/15 bg-white/5 backdrop-blur-md p-4"
            style={{
              boxShadow: "0 0 0 1px rgba(191,149,63,0.08), 0 24px 80px rgba(0,0,0,0.35)",
            }}
          >
            <div className="text-[10px] tracking-[0.22em] text-zinc-400">{x.label}</div>
            <div className="mt-2 flex items-center gap-2">
              <Heart className="h-4 w-4 text-[#fcf6ba]/80" />
              <div className="text-sm tracking-[0.08em] text-zinc-100">{x.value}</div>
            </div>
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(circle at 20% 10%, rgba(252,246,186,0.16) 0%, rgba(191,149,63,0.06) 55%, rgba(191,149,63,0) 70%)",
              }}
            />
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

function AvatarOrb({ hint }: { hint: string }) {
  return (
    <div className="relative flex h-11 w-11 items-center justify-center rounded-full border border-[#bf953f]/25 bg-white/5 backdrop-blur-md">
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "radial-gradient(circle at 30% 20%, rgba(252,246,186,0.18) 0%, rgba(191,149,63,0.08) 45%, rgba(191,149,63,0) 70%)",
          filter: "blur(0.2px)",
        }}
      />
      <span className="relative z-10 text-sm tracking-[0.2em] text-[#fcf6ba]/90">{hint}</span>
    </div>
  );
}

function PostCard({ post, idx }: { post: Post; idx: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 + idx * 0.08, duration: 0.75, ease: "easeOut" }}
      whileHover={{
        y: -10,
        boxShadow: "0 0 0 1px rgba(252,246,186,0.22), 0 30px 90px rgba(0,0,0,0.48)",
      }}
      className="group relative overflow-hidden rounded-3xl border border-[#bf953f]/15 bg-white/5 backdrop-blur-md p-5"
      style={{ borderColor: "rgba(191,149,63,0.18)" }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(circle at 20% 10%, rgba(252,246,186,0.18) 0%, rgba(191,149,63,0.06) 55%, rgba(191,149,63,0) 70%)",
        }}
      />
      <div className="relative z-10 flex items-start gap-4">
        <AvatarOrb hint={post.avatarHint} />
        <div className="flex-1">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-sm tracking-[0.08em] text-zinc-100">{post.author}</div>
              <div className="mt-1 text-[11px] tracking-[0.22em] text-zinc-400">{post.time}</div>
            </div>
            <Users className="h-4 w-4 text-[#fcf6ba]/55" />
          </div>

          <p className="mt-3 text-sm leading-relaxed text-zinc-300">{post.content}</p>

          <div className="mt-4 flex flex-wrap gap-2">
            {post.tags.map((t) => (
              <span
                key={t}
                className="rounded-full border border-[#bf953f]/20 bg-white/5 px-3 py-1 text-[11px] tracking-[0.16em] text-zinc-300"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export default function OriginsPage() {
  return (
    <StarBackdrop>
      <main className="relative min-h-screen w-full overflow-x-hidden text-zinc-100">
        <div className="relative z-10 mx-auto w-full max-w-6xl px-6 py-20">
          <div className="flex flex-col items-center text-center">
            <DiaryCard />
          </div>

          <div className="mt-10 grid grid-cols-1 gap-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#bf953f]/25 bg-white/5 backdrop-blur-md px-4 py-2 mx-auto">
              <Sparkles className="h-4 w-4 text-[#fcf6ba]/90" />
              <span className="text-[11px] tracking-[0.22em] text-zinc-300">社交极光流</span>
            </div>

            {POSTS.map((post, idx) => (
              <PostCard key={post.id} post={post} idx={idx} />
            ))}
          </div>
        </div>
      </main>
    </StarBackdrop>
  );
}

