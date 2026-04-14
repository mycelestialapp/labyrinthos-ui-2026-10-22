import { NextResponse } from "next/server";
import { computeNumerologyProfile, parseNumerologyProfileBody } from "@/lib/numerology-profile";

/**
 * 坛城数轨 · 毕达哥拉斯数秘演算（服务端与 lib 同源）。
 * POST JSON：{ month, day, year, nameLatin?, calendarYear? }
 */
export async function POST(req: Request) {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json", message: "请求体须为 JSON" }, { status: 400 });
  }

  const parsed = parseNumerologyProfileBody(raw);
  if (!parsed.ok) {
    return NextResponse.json({ ok: false, error: parsed.error, message: parsed.message }, { status: 400 });
  }

  const profile = computeNumerologyProfile(parsed.value);
  return NextResponse.json(profile);
}
