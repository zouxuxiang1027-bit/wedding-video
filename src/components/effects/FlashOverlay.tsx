/**
 * FlashOverlay.tsx — 闪光溶解叠加（S3→S4）
 *
 * 白色闪光从中心爆发，模拟"电光火石"的相遇瞬间。
 * 持续 9 帧（0.3s），两端慢中间快。
 */

import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";

interface FlashOverlayProps {
  durationInFrames: number;
}

export const FlashOverlay: React.FC<FlashOverlayProps> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();

  // 快速闪白：0 → 1(峰值) → 0
  const intensity =
    frame < durationInFrames / 2
      ? interpolate(frame, [0, durationInFrames / 2], [0, 1], { easing: Easing.in(Easing.cubic) })
      : interpolate(frame, [durationInFrames / 2, durationInFrames], [1, 0], { easing: Easing.out(Easing.cubic) });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: `rgba(255,255,255,${intensity})`,
        pointerEvents: "none",
      }}
    />
  );
};
