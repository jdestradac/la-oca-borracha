"use client";

import { useEffect, useState } from "react";

const IMAGE_EXTENSIONS = ["png", "jpg"];

function baseNameFor(position: number): string {
  if (position === 0) return "square-start";
  if (position === 47) return "square-winner";
  return `square-${position}`;
}

/** Resolves once an image loads, or once every known extension has failed. */
function settle(position: number, extIndex: number): Promise<void> {
  return new Promise((resolve) => {
    if (extIndex >= IMAGE_EXTENSIONS.length) {
      resolve();
      return;
    }
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => settle(position, extIndex + 1).then(resolve);
    img.src = `/assets/images/squares/${baseNameFor(position)}.${IMAGE_EXTENSIONS[extIndex]}`;
  });
}

/** True once every board square image has either loaded or given up (so the
 * board can render as a single, already-settled grid instead of images
 * popping in one at a time). Resolves quickly on repeat visits since the
 * browser cache already has everything. */
export function useBoardImagesReady(): boolean {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const positions = Array.from({ length: 48 }, (_, i) => i);
    Promise.all(positions.map((pos) => settle(pos, 0))).then(() => {
      if (!cancelled) setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return ready;
}
