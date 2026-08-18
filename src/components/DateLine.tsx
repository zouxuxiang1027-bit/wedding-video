/**
 * DateLine.tsx — S8 婚礼日期行
 *
 * 楷体、金色 80% 不透明度、最晚淡入（比主题字晚 30 帧 / 1s）。
 */

import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { GOLD } from "../palette";
import { FONT_FAMILY } from "../fonts/fonts";

interface DateLineProps {
  /** 日期文本，如 "二〇二六年十月一日" */
  text: string;
  /** 开始淡入的帧偏移 */
  startOffset?: number;
  /** 淡入持续帧数（默认 30 帧 = 1s） */
  fadeInFrames?: number;
}

export const DateLine: React.FC<DateLineProps> = ({
  text,
  startOffset = 150,
  fadeInFrames = 30,
}) => {
  const frame = useCurrentFrame();

  const opacity =
    frame < startOffset
      ? 0
      : interpolate(
          frame - startOffset,
          [0, fadeInFrames],
          [0, 0.8],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
        );

  if (opacity <= 0.001) return null;

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          bottom: "12%",
          left: "50%",
          transform: "translateX(-50%)",
          fontFamily: FONT_FAMILY.kai,
          fontSize: "32px",
          color: GOLD,
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
