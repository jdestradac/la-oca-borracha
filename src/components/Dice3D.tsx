"use client";

import { useEffect, useRef, useState } from "react";

const PIP_LAYOUTS: Record<number, number[]> = {
  1: [5],
  2: [1, 9],
  3: [1, 5, 9],
  4: [1, 3, 7, 9],
  5: [1, 3, 5, 7, 9],
  6: [1, 3, 4, 6, 7, 9],
};

const FACE_ROTATION: Record<number, { x: number; y: number }> = {
  1: { x: 0, y: 0 },
  2: { x: 0, y: 180 },
  3: { x: 0, y: -90 },
  4: { x: 0, y: 90 },
  5: { x: -90, y: 0 },
  6: { x: 90, y: 0 },
};

function Face({ number, className }: { number: number; className: string }) {
  const active = new Set(PIP_LAYOUTS[number]);
  return (
    <div className={`dice-face ${className}`}>
      {Array.from({ length: 9 }, (_, i) => i + 1).map((cell) => (
        <span key={cell} className="dice-pip" style={{ visibility: active.has(cell) ? "visible" : "hidden" }} />
      ))}
    </div>
  );
}

export function Dice3D({ value, spinToken }: { value: number; spinToken: number }) {
  const spin = useRef({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(() => ({ x: 0, y: 0 }));

  useEffect(() => {
    if (spinToken === 0) return;
    spin.current.x += 720 + (Math.floor(Math.random() * 2) + 1) * 360;
    spin.current.y += 720 + (Math.floor(Math.random() * 2) + 1) * 360;
    const base = FACE_ROTATION[value] ?? FACE_ROTATION[1];
    setRotation({ x: spin.current.x + base.x, y: spin.current.y + base.y });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spinToken]);

  return (
    <div className="dice-scene">
      <div
        className="dice-cube"
        style={{ transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)` }}
      >
        <Face number={1} className="dice-face-1" />
        <Face number={2} className="dice-face-2" />
        <Face number={3} className="dice-face-3" />
        <Face number={4} className="dice-face-4" />
        <Face number={5} className="dice-face-5" />
        <Face number={6} className="dice-face-6" />
      </div>
    </div>
  );
}
