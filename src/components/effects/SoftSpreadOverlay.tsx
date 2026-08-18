/**
 * SoftSpreadOverlay.tsx — 柔光扩散叠加（S5b→S6）
 *
 * 温暖的柔光从画面中心向外柔和扩散，象征情绪的升华。
 */

import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";

interface SoftSpreadOverlayProps {
  durationInFrames: number;
}

export const SoftSpreadOverlay: React.FC<SoftSpreadOverlayProps> = ({
  durationInFrames,
}) => {
  const frame = useCurrentFrame();

  // 扩散半径：0% → 150%
  const radius = interpolate(
    frame,
    [0, durationInFrames],
    [0, 150],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // 透明度：1 → 0
  const opacity = interpolate(
    frame,
    [0, durationInFrames],
    [0.4, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at center, rgba(212,175,55,${opacity}) 0%, transparent ${radius}%)`,
        pointerEvents: "none",
        mixBlendMode: "screen",
      }}
    />
  );
};
