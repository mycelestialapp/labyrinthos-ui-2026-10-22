import { NextResponse } from "next/server";
import { generateQ02Spread } from "@/lib/tarot-western-reading/q02-spread-live";

export const maxDuration = 60;

const SPREADS = new Set(["celtic", "triangle", "choice", "hexagram", "trinity", "venus"]);

export async function POST(req: Request) {
  let body: { question?: string; spread?: string; cards?: string[] } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ fallback: true }, { status: 400 });
  }
  const question = String(body.question || "");
  const spread = String(body.spread || "");
  const cards = Array.isArray(body.cards) ? body.cards.map((id) => String(id || "")) : [];
  if (question.indexOf("信哪头") === -1 || !SPREADS.has(spread) || cards.some((id) => !/^[a-z0-9_]+$/.test(id))) {
    return NextResponse.json({ fallback: true });
  }
  try {
    const result = await generateQ02Spread(spread, cards);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ fallback: true });
  }
}
