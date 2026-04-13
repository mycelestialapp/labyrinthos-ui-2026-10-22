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

/** 从 content 对象起始的 `{` 扫描到匹配的 `}`（深度），返回该 `}` 的下标 */
function findClosingBraceIndex(ts, openBraceIdx) {
  let depth = 0;
  let i = openBraceIdx;
  while (i < ts.length) {
    const c = ts[i];
    if (c === "`") {
      i = skipTemplateString(ts, i);
      continue;
    }
    if (c === "{") depth++;
    else if (c === "}") {
      depth--;
      if (depth === 0) return i;
    }
    i++;
  }
  return -1;
}

export function findRegisterBlockRange(ts, questionConst, cardId, upright) {
  const needle = `register(感情婚姻, ${questionConst}, '${cardId}', ${upright}, {`;
  const start = ts.indexOf(needle);
  if (start === -1) return null;
  const openBrace = start + needle.length - 1;
  const closeBrace = findClosingBraceIndex(ts, openBrace);
  if (closeBrace < 0) return null;
  let end = closeBrace + 1;
  while (end < ts.length && /[\s\r\n]/.test(ts[end])) end++;
  if (ts.slice(end, end + 2) !== ");") {
    throw new Error(`register 块未以 ); 结束: ${questionConst} ${cardId} ${upright}`);
  }
  end += 2;
  return { start, end };
}
