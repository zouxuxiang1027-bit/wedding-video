/**
 * GoldCurtainOverlay.tsx — 金色光幕叠加（S6→S7）
 *
 * 金色光带从画面四周向中心汇聚，象征从甜蜜时刻进入庄严礼成。
 */

import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { GOLD } from "../../palette";

interface GoldCurtainOverlayProps {
  durationInFrames: number;
}

export const GoldCurtainOverlay: React.FC<GoldCurtainOverlayProps> = ({
  durationInFrames,
}) => {
  const frame = useCurrentFrame();

  // 光带从边缘向中心推进：100% → 0%
  const progress = interpolate(
    frame,
    [0, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) }
  );

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {/* 上 */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: `${progress * 50}%`,
          background: `linear-gradient(to bottom, ${GOLD} 0%, transparent 100%)`,
          opacity: 0.5,
        }}
      />
      {/* 下 */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: `${progress * 50}%`,
          background: `linear-gradient(to top, ${GOLD} 0%, transparent 100%)`,
          opacity: 0.5,
        }}
      />
      {/* 左 */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          width: `${progress * 30}%`,
          background: `linear-gradient(to right, ${GOLD} 0%, transparent 100%)`,
          opacity: 0.4,
        }}
      />
      {/* 右 */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          width: `${progress * 30}%`,
          background: `linear-gradient(to left, ${GOLD} 0%, transparent 100%)`,
          opacity: 0.4,
        }}
      />
    </AbsoluteFill>
  );
};
