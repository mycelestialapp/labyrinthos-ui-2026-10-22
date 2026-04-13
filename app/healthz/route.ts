import { NextResponse } from "next/server";

/** 用于排查「地址栏已是 /tarot 但页面仍是新标签页/空白」：若此地址无响应，多半是 dev 未起或端口/本机解析问题。 */
export function GET() {
  return new NextResponse("ok", {
    status: 200,
    headers: { "cache-control": "no-store" },
  });
}
