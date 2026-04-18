/**
 * 静态检查：数秘子路由 page 是否存在（无需启动 dev server）。
 */
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const routes = ["", "chart", "matrix", "wheel", "syn"];

for (const seg of routes) {
  const dir = seg ? path.join(root, "app", "numerology", seg) : path.join(root, "app", "numerology");
  const pagePath = path.join(dir, "page.tsx");
  if (!fs.existsSync(pagePath)) {
    throw new Error(`missing page: ${pagePath}`);
  }
}

console.log("verify-numerology-routes: ok");
