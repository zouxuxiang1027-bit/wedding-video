/**
 * FinalTitle.tsx — S8 主题大字「缘定今生」
 *
 * 红金渐变 + 外发光 + 浮入弹跳动画。
 * 占画面宽度约 35%（约 670px @ 1920）。
 */

import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, Easing } from "remotion";
import { RED_TO_GOLD_GRADIENT } from "../palette";
import { FONT_FAMILY } from "../fonts/fonts";

interface FinalTitleProps {
  /** 文本内容 */
  text: string;
  /** 开始浮现的帧（相对 S7_START 的偏移） */
  startOffset?: number;
  /** 浮入持续帧数（默认 24 帧 = 0.8s） */
  fadeInFrames?: number;
}

export const FinalTitle: React.FC<FinalTitleProps> = ({
  text,
  startOffset = 120,
  fadeInFrames = 24,
}) => {
  const frame = useCurrentFrame();

  // 弹跳缓动（overshoot 效果）
  const pop = spring({
    frame: frame - startOffset,
    fps: 30,
    config: {
      damping: 12,
      stiffness: 120,
    },
  });

  // Y 轴浮入：从下方 40px 弹到原位
  const translateY = (1 - pop) * 40;

  // 透明度
  const opacity =
    frame < startOffset
      ? 0
      : interpolate(
          frame - startOffset,
          [0, fadeInFrames],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );

  if (opacity <= 0.001) return null;

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          top: "30%",
          left: "50%",
          transform: `translateX(-50%) translateY(${translateY}px)`,
          fontFamily: FONT_FAMILY.calligraphy,
          fontSize: "120px",
          fontWeight: "bold",
          backgroundImage: RED_TO_GOLD_GRADIENT,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          filter: "drop-shadow(0 0 20px rgba(212,175,55,.4)) drop-shadow(0 0 40px rgba(196,30,58,.2))",
          opacity,
          whiteSpace: "nowrap",
          textAlign: "center" as const,
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};
