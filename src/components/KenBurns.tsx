/**
 * KenBurns.tsx — 运镜工具组件
 *
 * 基于 useCurrentFrame + interpolate 实现多种运镜效果：
 * - push-in: 极慢推近（scale 增大）
 * - pan-left: 画卷左移
 * - spotlight: 聚光灯推近 + 暗角收缩
 * - heartbeat: 心跳脉冲缩放
 * - rotate: 微旋转
 */

import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";

export type KenBurnsType =
  | "push-in"
  | "pan-left"
  | "spotlight"
  | "heartbeat"
  | "rotate";

interface KenBurnsProps {
  /** 当前场景总帧数 */
  durationInFrames: number;
  /** 运镜类型 */
  type: KenBurnsType;
  /** scale 起始值（默认 1.0 = 100%） */
  scaleFrom?: number;
  /** scale 结束值 */
  scaleTo?: number;
  /** X 平移起始百分比（如 8 表示右移 8%） */
  translateXFrom?: number;
  /** X 平移结束百分比 */
  translateXTo?: number;
  /** Y 平移起始百分比 */
  translateYFrom?: number;
  /** Y 平移结束百分比 */
  translateYTo?: number;
  /** 旋转起始角度（度） */
  rotateFrom?: number;
  /** 旋转结束角度（度） */
  rotateTo?: number;
  /** 子元素（通常是 PhotoFrame） */
  children: React.ReactNode;
}

/**
 * 缓动曲线映射（对应脚本 6.2 节的 ease-out / ease-in-out / linear）
 */
const easingMap: Record<string, (t: number) => number> = {
  "ease-out": Easing.out(Easing.cubic),
  "ease-in-out": Easing.inOut(Easing.cubic),
  linear: Easing.linear,
};

export const KenBurns: React.FC<KenBurnsProps> = ({
  durationInFrames,
  type,
  scaleFrom = 1.0,
  scaleTo = 1.0,
  translateXFrom = 0,
  translateXTo = 0,
  translateYFrom = 0,
  translateYTo = 0,
  rotateFrom = 0,
  rotateTo = 0,
  children,
}) => {
  const frame = useCurrentFrame();

  // 根据类型计算 transform
  let scale = scaleFrom;
  let tx = translateXFrom;
  let ty = translateYFrom;
  let rot = rotateFrom;

  switch (type) {
    case "push-in":
      // S1: 极慢推近 100%→108%
      scale = interpolate(frame, [0, durationInFrames], [scaleFrom, scaleTo], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: easingMap["ease-out"],
      });
      break;

    case "pan-left":
      // S2: 画卷左移 scale 105%→100%, X +8%→0
      scale = interpolate(
        frame,
        [0, durationInFrames],
        [scaleFrom, scaleTo],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
      );
      tx = interpolate(
        frame,
        [0, durationInFrames],
        [translateXFrom, translateXTo],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
      );
      break;

    case "spotlight":
      // S3: 聚光灯推近 95%→102%
      scale = interpolate(frame, [0, durationInFrames], [scaleFrom, scaleTo], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: easingMap["ease-out"],
      });
      break;

    case "heartbeat": {
      // S6: 1Hz 心跳脉冲 100%↔103%
      const freq = 1; // Hz
      const amp = (scaleTo - scaleFrom) / 2;
      const mid = (scaleFrom + scaleTo) / 2;
      scale = mid + amp * Math.abs(Math.sin((frame / 30) * Math.PI * freq));
      break;
    }

    case "rotate":
      // S5b: 微旋转 0°→2°
      rot = interpolate(frame, [0, durationInFrames], [rotateFrom, rotateTo], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      break;
  }

  return (
    <AbsoluteFill
      style={{
        transform: `scale(${scale}) translate(${tx}%, ${ty}%) rotate(${rot}deg)`,
        transformOrigin: "center center",
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
