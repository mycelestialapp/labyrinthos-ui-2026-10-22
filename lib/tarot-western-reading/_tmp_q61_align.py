# -*- coding: utf-8 -*-
from pathlib import Path
import re

base = Path(__file__).resolve().parent

for f in ["choice-q61-04.ts", "choice-q61-05.ts", "choice-q61-06.ts"]:
    t = (base / f).read_text(encoding="utf-8")
    parts = re.split(r'(?=  r\(")', t)
    out = [parts[0]]
    for part in parts[1:]:
        m = re.search(r'r\("[^"]+",\s*"[^"]+",\s*(?:true|false),\s*"(说明[^：]+)：', part)
        if not m:
            out.append(part)
            continue
        tag = m.group(1)
        # replace any 说明X： or 说明X。 after first lean occurrence
        state = {"n": 0}

        def repl_colon(mm: re.Match) -> str:
            state["n"] += 1
            if state["n"] == 1:
                return mm.group(0)
            return tag + "："

        def repl_period(mm: re.Match) -> str:
            return tag + "。"

        part2 = re.sub(r"说明(?:耗尽|对了该歇|逃|慌)：", repl_colon, part)
        part2 = re.sub(r"说明(?:耗尽|对了该歇|逃|慌)。", repl_period, part2)
        out.append(part2)
    (base / f).write_text("".join(out), encoding="utf-8")
    print("done", f)

# also 01-03 for period form consistency within card
for f in ["choice-q61-01.ts", "choice-q61-02.ts", "choice-q61-03.ts"]:
    t = (base / f).read_text(encoding="utf-8")
    parts = re.split(r'(?=  r\(")', t)
    out = [parts[0]]
    for part in parts[1:]:
        m = re.search(r'r\("[^"]+",\s*"[^"]+",\s*(?:true|false),\s*"(说明[^：]+)：', part)
        if not m:
            out.append(part)
            continue
        tag = m.group(1)
        state = {"n": 0}

        def repl_colon(mm: re.Match) -> str:
            state["n"] += 1
            if state["n"] == 1:
                return mm.group(0)
            return tag + "："

        def repl_period(mm: re.Match) -> str:
            return tag + "。"

        part2 = re.sub(r"说明(?:耗尽|对了该歇|逃|慌)：", repl_colon, part)
        part2 = re.sub(r"说明(?:耗尽|对了该歇|逃|慌)。", repl_period, part2)
        out.append(part2)
    (base / f).write_text("".join(out), encoding="utf-8")
    print("maj", f)
