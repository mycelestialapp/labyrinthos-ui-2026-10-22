import { writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  TAROT_DIR_BY_CATEGORY_WESTERN,
  TAROT_WESTERN_CATALOG,
  getTarotFollowupsWestern,
} from "../lib/tarot-western";

const groupsById: Record<string, Array<{ label: string; categoryId?: string; surface: string[] }>> = {};
const filtersById: Record<string, unknown> = {};
const followupsById: Record<string, Array<{ intent: string; label: string; canonical: string }>> = {};

for (const cat of TAROT_WESTERN_CATALOG) {
  groupsById[cat.id] = cat.groups
    .filter((g) => g.surface.length)
    .map((g) => ({
      label: g.label,
      categoryId: g.categoryId ?? cat.id,
      surface: [...g.surface],
    }));
  const dir = TAROT_DIR_BY_CATEGORY_WESTERN[cat.id];
  if (dir) filtersById[cat.id] = dir.tabs;
  followupsById[cat.id] = getTarotFollowupsWestern(cat.id).map((c) => ({
    intent: c.intent,
    label: c.label,
    canonical: c.canonical,
  }));
}

const body = `window.TarotQuestionWestern = ${JSON.stringify({
  groups: groupsById,
  filters: filtersById,
  followups: followupsById,
})};`;

const out = join(process.cwd(), "public", "tarotQuestionWestern.js");
writeFileSync(out, body, "utf8");
for (const [id, groups] of Object.entries(groupsById)) {
  const n = groups.reduce((s, g) => s + g.surface.length, 0);
  console.log(`${id}\tsurface=${n}\tgroups=${groups.length}`);
}
console.log(`wrote ${out}`);
