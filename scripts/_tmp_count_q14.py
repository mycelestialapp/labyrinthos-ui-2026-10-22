from pathlib import Path

root = Path(r"E:\labyrinthos-ui\lib\tarot-western-reading")
files = [root / f"money-q14-0{i}.ts" for i in range(1, 7)]
n = 0
hanged = 0
q = None
for p in files:
    t = p.read_text(encoding="utf-8")
    n += t.count('r("')
    hanged += t.count("倒吊人")
    for ln in t.splitlines():
        if ln.startswith("export const MONEY_Q14 ="):
            q = ln
print("r_calls", n, "hanged_mentions", hanged)
print(q)
