import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Third-party bundled assets (not source files):
    "public/vendor/**",
    "**/*.min.js",
    // esbuild 临时 Node 产物（含 require；见 package.json tarot:*:freeze / emit-layers）
    "scripts/.freeze-*.cjs",
    "scripts/.emit-*.cjs",
    // 塔罗静态 IIFE 大包（非手改源码）
    "public/tarotQuestion*.js",
    "public/tarotData.js",
    "public/tarotMasterReadings.js",
  ]),
]);

export default eslintConfig;
