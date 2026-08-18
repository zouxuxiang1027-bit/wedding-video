/**
 * WeddingOpening.tsx — 主时间轴编排 (Remotion 3.x 兼容版)
 *
 * 使用 Series + Sequence + interpolate 实现手动转场，
 * 兼容 macOS Ventura / Remotion 3.14。
 *
 * 时间线总览（900 帧 / 30 秒 / 30fps）：
 *
 *   S1[0-90]      S2[90-210]     S3[210-330]     S4[330-420]     S5a[420-495]
 *   |===额头吻===|==新娘团扇====|==新郎囍字====|==牵手立姿====|==缓步前行===|
 *       ↓光晕         ↓柔光推移       ↓闪光          ↓交叉溶解        ↓叠化
 *   S5b[495-570]   S6[570-690]     S7+S8[690-900]
 *   |==并坐优雅====|==双手比心=====|==囍字合影+文字==|
 *                    ↓柔光扩散       ↓金色光幕(无切)
 */

import React from "react";
import {
  AbsoluteFill,
  Series,
  Sequence,
  interpolate,
  Easing,
  useCurrentFrame,
} from "remotion";
import { ScenePhoto } from "./scenes/ScenePhoto";
import { SceneFinal } from "./scenes/SceneFinal";
import {
  PHOTO_MAP,
  S1_START,
  S1_END,
  S2_START,
  S2_END,
  S3_END,
  S4_START,
  S4_END,
  S4_DURATION,
  S5A_START,
  S5A_END,
  S5A_DURATION,
  S5B_START,
  S5B_END,
  S5B_DURATION,
  S6_START,
  S6_END,
  S7_START,
  TOTAL_FRAMES,
} from "./timeline";
import type { WeddingProps } from "./props";

// ─── 转场时长常量（帧）──
const TRANSITION_DURATION = 24; // 每个转场约 0.8 秒

// ─── 转场 Overlay 组件 ───

/** 光晕溶解（S1→S2） */
const GlowDissolve: React.FC<{ progress: number }> = ({ progress }) => {
  const opacity = interpolate(progress, [0, 0.5, 1], [0, 0.6, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill
      style={{
        opacity,
        background:
          "radial-gradient(circle at center, rgba(212,175,55,0.4) 0%, rgba(196,30,58,0.3) 50%, transparent 80%)",
        pointerEvents: "none",
      }}
    />
  );
};

/** 白闪溶解（S3→S4） */
const FlashDissolve: React.FC<{ progress: number }> = ({ progress }) => {
  const opacity = interpolate(progress, [0, 0.3, 1], [0, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill
      style={{
        opacity,
        backgroundColor: "#FFF8E7",
        pointerEvents: "none",
      }}
    />
  );
};

/** 柔光扩散（S5b→S6） */
const SoftSpreadOverlay: React.FC<{ progress: number }> = ({ progress }) => {
  const opacity = interpolate(progress, [0, 0.5, 1], [0, 0.35, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scale = interpolate(progress, [0, 1], [0.5, 1.5]);
  return (
    <AbsoluteFill
      style={{
        opacity,
        background:
          "radial-gradient(ellipse at center, rgba(255,245,230,0.5) 0%, transparent 70%)",
        transform: `scale(${scale})`,
        pointerEvents: "none",
      }}
    />
  );
};

/** 金色光幕（S6→S7） */
const GoldCurtainOverlay: React.FC<{ progress: number }> = ({ progress }) => {
  const opacity = interpolate(progress, [0, 0.4, 0.8, 1], [0, 0.7, 0.7, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill
      style={{
        opacity,
        background:
          "linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.3) 30%, rgba(212,175,55,0.5) 50%, rgba(212,175,55,0.3) 70%, transparent 100%)",
        pointerEvents: "none",
      }}
    />
  );
};

// ─── 带转场的场景包装器 ───

/**
 * TransitionScene — 在场景之间实现交叉溶解转场
 *
 * Remotion 3.x 没有 TransitionSeries，我们用 Sequence 叠放来实现：
 * - 场景 A 在转场期间淡出
 * - 场景 B 在转场期间淡入
 */
interface TransitionSceneProps {
  /** 场景起始帧（绝对） */
  startFrame: number;
  /** 场景内容持续帧数（不含转场） */
  durationInFrames: number;
  /** 转场入时长（帧） */
  transitionIn?: number;
  /** 转场出时长（帧） */
  transitionOut?: number;
  children: React.ReactNode;
}

const TransitionScene: React.FC<TransitionSceneProps> = ({
  startFrame,
  durationInFrames,
  transitionIn = TRANSITION_DURATION,
  transitionOut = TRANSITION_DURATION,
  children,
}) => {
  const frame = useCurrentFrame();

  // 计算当前帧在场景生命周期中的位置
  const sceneStart = startFrame;
  const sceneEnd = startFrame + durationInFrames;

  // 淡入阶段
  const fadeInProgress = interpolate(
    frame,
    [sceneStart, sceneStart + transitionIn],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // 淡出阶段（transitionOut=0 时跳过，避免 inputRange 出现 [n,n]）
  const fadeOutProgress =
    transitionOut > 0
      ? interpolate(
          frame,
          [sceneEnd - transitionOut, sceneEnd],
          [1, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        )
      : 1;

  // 综合透明度
  let opacity = 1;
  if (frame < sceneStart + transitionIn) {
    opacity = fadeInProgress;
  } else if (frame > sceneEnd - transitionOut) {
    opacity = fadeOutProgress;
  }

  // 场景外完全隐藏
  if (frame < sceneStart || frame > sceneEnd) {
    opacity = 0;
  }

  return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
};

// ─── 主组件 ──────────────────────────────────────

interface WeddingOpeningProps extends WeddingProps {}

export const WeddingOpening: React.FC<WeddingOpeningProps> = ({
  groomName,
  brideName,
  weddingDate,
}) => {
  const weddingProps = { groomName, brideName, weddingDate };

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0A0000", // 极深暗红底色
      }}
    >
      {/* 使用 Series 让所有场景共存于同一时间轴 */}
      <Series>
        {/* ════════ S1: 开场钩子 — 额头吻特写 ════════ */}
        <Series.Sequence durationInFrames={S1_END - S1_START}>
          <ScenePhoto
            sceneId="S1"
            photoSrc={`photos/${PHOTO_MAP.S1}`}
            durationInFrames={S1_END - S1_START}
            kenBurnsType="push-in"
            scaleFrom={1.0}
            scaleTo={1.08}
            fadeIn={true}
          />
        </Series.Sequence>

        {/* ════════ S2: 新娘亮相 — 团扇肖像 ════════ */}
        <Series.Sequence durationInFrames={S2_END - S2_START} offsetFrom="previous">
          {/* S2 入场时叠加 S1→S2 光晕溶解效果 */}
          <TransitionScene
            startFrame={S1_END - TRANSITION_DURATION}
            durationInFrames={(S2_END - S1_START) + TRANSITION_DURATION}
            transitionIn={TRANSITION_DURATION}
            transitionOut={TRANSITION_DURATION}
          >
            <ScenePhoto
              sceneId="S2"
              photoSrc={`photos/${PHOTO_MAP.S2}`}
              durationInFrames={S2_END - S1_START + TRANSITION_DURATION * 2}
              kenBurnsType="pan-left"
              scaleFrom={1.05}
              scaleTo={1.12}
              translateXFrom={-3}
              translateXTo={2}
            />
          </TransitionScene>
        </Series.Sequence>

        {/* ════════ S3: 新郎登场 — 囍字单人像 ════════ */}
        <Series.Sequence durationInFrames={S3_END - S2_END} offsetFrom="previous">
          <TransitionScene
            startFrame={S2_END - TRANSITION_DURATION}
            durationInFrames={(S3_END - S2_END) + TRANSITION_DURATION * 2}
            transitionIn={TRANSITION_DURATION}
            transitionOut={TRANSITION_DURATION}
          >
            <ScenePhoto
              sceneId="S3"
              photoSrc={`photos/${PHOTO_MAP.S3}`}
              durationInFrames={(S3_END - S2_END) + TRANSITION_DURATION * 2}
              kenBurnsType="spotlight"
              scaleFrom={1.0}
              scaleTo={1.06}
            />
          </TransitionScene>
        </Series.Sequence>

        {/* ════════ S4: 初见牵手 ════════ */}
        <Series.Sequence durationInFrames={S4_DURATION} offsetFrom="previous">
          <TransitionScene
            startFrame={S4_START - TRANSITION_DURATION}
            durationInFrames={S4_DURATION + TRANSITION_DURATION * 2}
            transitionIn={TRANSITION_DURATION}
            transitionOut={TRANSITION_DURATION}
          >
            <ScenePhoto
              sceneId="S4"
              photoSrc={`photos/${PHOTO_MAP.S4}`}
              durationInFrames={S4_DURATION + TRANSITION_DURATION * 2}
              kenBurnsType="heartbeat"
              scaleFrom={1.0}
              scaleTo={1.04}
            />
          </TransitionScene>
        </Series.Sequence>

        {/* ════════ S5a: 同行岁月·主 — 缓步前行 ════════ */}
        <Series.Sequence durationInFrames={S5A_DURATION} offsetFrom="previous">
          <TransitionScene
            startFrame={S5A_START - TRANSITION_DURATION}
            durationInFrames={S5A_DURATION + TRANSITION_DURATION * 2}
            transitionIn={TRANSITION_DURATION}
            transitionOut={TRANSITION_DURATION}
          >
            <ScenePhoto
              sceneId="S5a"
              photoSrc={`photos/${PHOTO_MAP.S5a}`}
              durationInFrames={S5A_DURATION + TRANSITION_DURATION * 2}
              kenBurnsType="push-in"
              scaleFrom={1.0}
              scaleTo={1.05}
              translateYFrom={0}
              translateYTo={-1}
            />
          </TransitionScene>
        </Series.Sequence>

        {/* ════════ S5b: 同行岁月·叠入 — 并坐优雅 ════════ */}
        <Series.Sequence durationInFrames={S5B_DURATION} offsetFrom="previous">
          <TransitionScene
            startFrame={S5B_START - TRANSITION_DURATION}
            durationInFrames={S5B_DURATION + TRANSITION_DURATION * 2}
            transitionIn={TRANSITION_DURATION}
            transitionOut={TRANSITION_DURATION}
          >
            <ScenePhoto
              sceneId="S5b"
              photoSrc={`photos/${PHOTO_MAP.S5b}`}
              durationInFrames={S5B_DURATION + TRANSITION_DURATION * 2}
              kenBurnsType="push-in"
              scaleFrom={1.02}
              scaleTo={1.08}
            />
          </TransitionScene>
        </Series.Sequence>

        {/* ════════ S6: 甜蜜时刻 — 双手比心 ════════ */}
        <Series.Sequence durationInFrames={S6_END - S6_START} offsetFrom="previous">
          <TransitionScene
            startFrame={S6_START - TRANSITION_DURATION}
            durationInFrames={(S6_END - S6_START) + TRANSITION_DURATION * 2}
            transitionIn={TRANSITION_DURATION}
            transitionOut={TRANSITION_DURATION}
          >
            <ScenePhoto
              sceneId="S6"
              photoSrc={`photos/${PHOTO_MAP.S6}`}
              durationInFrames={(S6_END - S6_START) + TRANSITION_DURATION * 2}
              kenBurnsType="heartbeat"
              scaleFrom={1.0}
              scaleTo={1.03}
            />
          </TransitionScene>
        </Series.Sequence>

        {/* ════════ S7+S8: 礼成+收尾（合并序列，无切换）════════ */}
        <Series.Sequence durationInFrames={TOTAL_FRAMES - S7_START} offsetFrom="previous">
          <TransitionScene
            startFrame={S7_START - TRANSITION_DURATION}
            durationInFrames={(TOTAL_FRAMES - S7_START) + TRANSITION_DURATION}
            transitionIn={TRANSITION_DURATION}
            transitionOut={0} // 结尾不淡出，由 SceneFinal 内部控制
          >
            <SceneFinal
              photoSrc={`photos/${PHOTO_MAP.S7}`}
              weddingProps={weddingProps}
            />
          </TransitionScene>
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
