/**
 * GoldDust.tsx — S8 金色光尘粒子
 *
 * 30–50 个微小金色粒子在画面中缓慢随机漂移，
 * 生命周期 3–5 秒，仅 S8 段可见。
 */

import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { GOLD } from "../palette";

interface GoldDustProps {
  /** 粒子数量（默认 40） */
  count?: number;
  /** 开始显示的帧号（默认 0 = 立即显示） */
  startFrame?: number;
}

/** 基于种子的伪随机数生成器 */
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

interface Particle {
  id: number;
  x: number; // 初始 X 位置 (%)
  y: number; // 初始 Y 位置 (%)
  size: number; // 粒子大小 (px)
  speedX: number; // X 方向速度 (px/frame)
  speedY: number; // Y 方向速度 (px/frame)
  life: number; // 生命周期 (帧)
  delay: number; // 出现延迟 (帧)
  opacity: number; // 最大不透明度
}

function generateParticles(count: number, seed: number = 42): Particle[] {
  const rng = seededRandom(seed);
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: rng() * 100,
    y: rng() * 100,
    size: 2 + rng() * 4,
    speedX: (rng() - 0.5) * 0.8,
    speedY: (rng() - 0.5) * 0.6,
    life: 90 + rng() * 60, // 3-5s @30fps
    delay: Math.floor(rng() * 30), // 0-1s 延迟
    opacity: 0.3 + rng() * 0.5,
  }));
}

export const GoldDust: React.FC<GoldDustProps> = ({ count = 40, startFrame = 0 }) => {
  const frame = useCurrentFrame();

  // 未到开始时间则不渲染
  if (frame < startFrame) return null;

  const particles = generateParticles(count);

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {particles.map((p) => {
        const age = frame - p.delay;
        if (age < 0 || age > p.life) return null;

        // 生命周期内透明度：淡入 → 保持 → 淡出
        const lifeRatio = age / p.life;
        const alpha =
          lifeRatio < 0.2
            ? lifeRatio / 0.2
            : lifeRatio > 0.8
              ? (1 - lifeRatio) / 0.2
              : 1;

        const currentX = p.x + p.speedX * age;
        const currentY = p.y + p.speedY * age;

        return (
          <div
            key={p.id}
            style={{
              position: "absolute",
              left: `${currentX}%`,
              top: `${currentY}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              borderRadius: "50%",
              backgroundColor: GOLD,
              opacity: alpha * p.opacity,
              boxShadow: `0 0 ${p.size * 2}px rgba(212,175,55,${alpha * p.opacity * 0.5})`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
