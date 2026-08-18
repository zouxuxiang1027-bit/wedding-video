/**
 * NamesLine.tsx — S8 新人姓名行
 *
 * 宋体 Bold、纯金色、字距加宽 150%，
 * 从两侧向中心汇聚浮现（比主题字晚 9 帧 / 0.3s）。
 */

import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { GOLD } from "../palette";
import { FONT_FAMILY } from "../fonts/fonts";

interface NamesLineProps {
  /** 姓名文本，如 "张明轩 & 林婉清" */
  text: string;
  /** 开始浮现的帧偏移 */
  startOffset?: number;
  /** 汇聚持续帧数（默认 30 帧 = 1s） */
  fadeInFrames?: number;
}

export const NamesLine: React.FC<NamesLineProps> = ({
  text,
  startOffset = 129,
  fadeInFrames = 30,
}) => {
  const frame = useCurrentFrame();

  // 两侧汇聚：左从 -80px → 0，右从 +80px → 0
  const offsetLeft =
    frame < startOffset
      ? -80
      : interpolate(
          frame - startOffset,
          [0, fadeInFrames],
          [-80, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
        );

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
          top: "52%",
          left: `calc(50% + ${offsetLeft}px)`,
          transform: "translateX(-50%)",
          fontFamily: FONT_FAMILY.serif,
          fontSize: "48px",
          fontWeight: "bold",
          color: GOLD,
          letterSpacing: "0.15em",
          opacity,
          whiteSpace: "nowrap",
          textAlign: "center" as const,
          textShadow: "0 0 4px rgba(212,175,55,.3)",
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};
