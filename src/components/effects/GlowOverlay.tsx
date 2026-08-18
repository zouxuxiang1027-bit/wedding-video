/**
 * GlowOverlay.tsx — 光晕溶解叠加（S1→S2 / S2→S3）
 *
 * 柔和的白色/金色光晕从中心扩散，用于场景间平滑过渡。
 * 作为 TransitionSeries.Overlay 使用，不压缩时间轴。
 */

import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";

interface GlowOverlayProps {
  /** 转场持续帧数 */
  durationInFrames: number;
  /** 光晕方向：'v' 垂直 / 'h' 水平（S2→S3 用水平推移） */
  direction?: "v" | "h";
}

export const GlowOverlay: React.FC<GlowOverlayProps> = ({
  durationInFrames,
  direction = "v",
}) => {
  const frame = useCurrentFrame();

  // 光晕强度：0 → 1 → 0 的钟形曲线
  const progress = frame / durationInFrames;
  const intensity =
    progress < 0.5
      ? interpolate(progress, [0, 0.5], [0, 0.35], { easing: Easing.inOut(Easing.cubic) })
      : interpolate(progress, [0.5, 1], [0.35, 0], { easing: Easing.inOut(Easing.cubic) });

  // 水平方向时添加位移效果
  const offset =
    direction === "h"
      ? interpolate(frame, [0, durationInFrames], [30, -30], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
      : 0;

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at center, rgba(255,248,220,${intensity}) 0%, transparent 70%)`,
        transform: `translateX(${offset}px)`,
        pointerEvents: "none",
        mixBlendMode: "screen",
      }}
    />
  );
};
