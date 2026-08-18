/**
 * Caption.tsx — 情绪字幕组件（S2–S6）
 *
 * 在指定位置浮现金色文字，带柔光投影。
 * 支持四种位置：bottom-left / bottom-right / bottom-center / top-center
 */

import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { GOLD, GLOW_SHADOW } from "../palette";
import { FONT_FAMILY } from "../fonts/fonts";

interface CaptionProps {
  /** 字幕文本 */
  text: string;
  /** 字幕开始显示的帧（相对场景起始） */
  startFrame?: number;
  /** 字幕淡入持续帧数（默认 15 帧 = 0.5s） */
  fadeInFrames?: number;
  /** 字幕位置 */
  position?: "bottom-left" | "bottom-right" | "bottom-center" | "top-center";
  /** 自定义字体族（默认楷体） */
  fontFamily?: string;
  /** 字号（px，默认 48） */
  fontSize?: number;
}

const POSITION_STYLES: Record<
  NonNullable<CaptionProps["position"]>,
  React.CSSProperties
> = {
  "bottom-left": {
    bottom: "8%",
    left: "8%",
    textAlign: "left" as const,
  },
  "bottom-right": {
    bottom: "8%",
    right: "8%",
    textAlign: "right" as const,
  },
  "bottom-center": {
    bottom: "6%",
    left: "50%",
    transform: "translateX(-50%)",
    textAlign: "center" as const,
  },
  "top-center": {
    top: "6%",
    left: "50%",
    transform: "translateX(-50%)",
    textAlign: "center" as const,
  },
};

export const Caption: React.FC<CaptionProps> = ({
  text,
  startFrame = 12,
  fadeInFrames = 15,
  position = "bottom-left",
  fontFamily = FONT_FAMILY.kai,
  fontSize = 48,
}) => {
  const frame = useCurrentFrame();

  // 仅在 startFrame 后开始淡入
  const opacity =
    frame < startFrame
      ? 0
      : interpolate(
          frame,
          [startFrame, startFrame + fadeInFrames],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
        );

  if (opacity <= 0.001) return null;

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          ...POSITION_STYLES[position],
          fontFamily,
          fontSize: `${fontSize}px`,
          color: GOLD,
          textShadow: GLOW_SHADOW,
          opacity,
          whiteSpace: "nowrap",
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};
