"use client";

import * as UTIF from "utif";
import {
  CanvasTexture,
  ClampToEdgeWrapping,
  LinearFilter,
  LinearMipmapLinearFilter,
  NoColorSpace,
  RepeatWrapping,
  SRGBColorSpace,
} from "three";

type TiffTextureOptions = {
  color?: boolean; // true = albedo / sRGB, false = data / height
};

const textureCache = new Map<string, Promise<CanvasTexture>>();

export function loadTiffTexture(url: string, options: TiffTextureOptions): Promise<CanvasTexture> {
  const existing = textureCache.get(url);
  if (existing) return existing;

  const p = (async () => {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Failed to fetch tiff: ${url}`);
    }

    const ab = await res.arrayBuffer();
    const ifds = UTIF.decode(ab);
    if (!ifds || ifds.length === 0) {
      throw new Error(`Failed to decode tiff: ${url}`);
    }

    // Use first frame/page.
    UTIF.decodeImage(ab, ifds[0]);
    const rgba = UTIF.toRGBA8(ifds[0]); // Uint8Array

    const w = ifds[0].width as number;
    const h = ifds[0].height as number;

    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("No canvas context");

    const img = ctx.createImageData(w, h);
    img.data.set(rgba);
    ctx.putImageData(img, 0, 0);

    const texture = new CanvasTexture(canvas);
    texture.needsUpdate = true;

    // Equirectangular-like maps: repeat horizontally.
    texture.wrapS = RepeatWrapping;
    texture.wrapT = ClampToEdgeWrapping;
    texture.minFilter = LinearMipmapLinearFilter;
    texture.magFilter = LinearFilter;

    // Default flipY can be wrong for pre-wrapped maps; keep as-is and adjust if needed.
    texture.flipY = false;

    texture.colorSpace = options.color ? SRGBColorSpace : NoColorSpace;

    return texture;
  })();

  textureCache.set(url, p);
  return p;
}

