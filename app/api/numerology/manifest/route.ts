import { NextResponse } from "next/server";
import { NUMEROLOGY_WORKSPACE_MODULES } from "@/lib/numerology-workspace-modules";

/** 工作台模块清单 + 演算端点说明（供前台或其它客户端 discover） */
export async function GET() {
  return NextResponse.json({
    ok: true as const,
    version: 1,
    modules: NUMEROLOGY_WORKSPACE_MODULES,
    endpoints: {
      profile: "/api/numerology/profile",
      profileMethod: "POST",
      profileBody: {
        month: "integer 1–12",
        day: "integer 1–31",
        year: "integer 1900–2100",
        nameLatin: "optional string，拉丁全拼",
        calendarYear: "optional integer，个人年所用年，默认当年",
      },
    },
  });
}
