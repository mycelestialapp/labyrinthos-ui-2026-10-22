/**
 * 从 tarot-master-question-content-love.ts 中按「具体问题常量」抽取 register 五段字段。
 * 括号深度扫描会跳过反引号模板字符串，避免内容里的 } 提前结束对象。
 */

function skipTemplateString(s, openBacktickIndex) {
  let i = openBacktickIndex + 1;
  while (i < s.length) {
    const c = s[i];
    if (c === "\\") {
      i += 2;
      continue;
    }
    if (c === "`") return i + 1;
    i++;
  }
  return i;
}

function extractTemplateField(block, fieldName) {
  const key = `${fieldName}:`;
  const idx = block.indexOf(key);
  if (idx < 0) return "";
  let p = idx + key.length;
  while (p < block.length && /\s/.test(block[p])) p++;
  if (block[p] !== "`") return "";
  const end = skipTemplateString(block, p);
  return block.slice(p + 1, end - 1);
}

function extractRegisterBody(restFromCardId) {
  const m = restFromCardId.match(/^'([^']+)',\s*(true|false),\s*\{/);
  if (!m) return null;
  const cardId = m[1];
  const upright = m[2] === "true";
  const brace0 = restFromCardId.indexOf("{");
  let i = brace0 + 1;
  let depth = 1;
  while (i < restFromCardId.length && depth > 0) {
    const c = restFromCardId[i];
    if (c === "`") {
      i = skipTemplateString(restFromCardId, i);
      continue;
    }
    if (c === "{") depth++;
    else if (c === "}") depth--;
    i++;
  }
  const inner = restFromCardId.slice(brace0, i);
  return { cardId, upright, inner };
}

export function parseRegistersForQuestion(ts, questionConstName) {
  const needle = `register(感情婚姻, ${questionConstName}, `;
  const map = new Map();
  let from = 0;
  while (true) {
    const i = ts.indexOf(needle, from);
    if (i < 0) break;
    const rest = ts.slice(i + needle.length);
    const parsed = extractRegisterBody(rest);
    if (!parsed) {
      from = i + needle.length + 1;
      continue;
    }
    const { cardId, upright, inner } = parsed;
    const content = {
      cardSpeaking: extractTemplateField(inner, "cardSpeaking"),
      psychologyLayer: extractTemplateField(inner, "psychologyLayer"),
      spiritLayer: extractTemplateField(inner, "spiritLayer"),
      actionPath: extractTemplateField(inner, "actionPath"),
      masterSummary: extractTemplateField(inner, "masterSummary"),
    };
    map.set(`${cardId}|${upright}`, content);
    const consumed = needle.length + rest.indexOf(inner) + inner.length;
    from = i + consumed + 2;
  }
  return map;
}
