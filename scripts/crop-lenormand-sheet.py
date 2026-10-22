from pathlib import Path

from PIL import Image

src = Path(r"E:\labyrinthos-ui\public\lenormand\_game-of-hope-sheet.png")
out = Path(r"E:\labyrinthos-ui\public\lenormand")
im = Image.open(src).convert("RGB")
x0, y0, x1, y1 = 28, 56, 1856, 2348
pad = 3
grid = 6
cw = (x1 - x0) / grid
ch = (y1 - y0) / grid
for i in range(36):
    r, c = divmod(i, grid)
    left = int(round(x0 + c * cw)) + pad
    top = int(round(y0 + r * ch)) + pad
    right = int(round(x0 + (c + 1) * cw)) - pad
    bottom = int(round(y0 + (r + 1) * ch)) - pad
    card = im.crop((left, top, right, bottom))
    card.save(out / f"{i + 1:02d}.png", optimize=True)
print("ok", (out / "01.png").stat().st_size, card.size)
