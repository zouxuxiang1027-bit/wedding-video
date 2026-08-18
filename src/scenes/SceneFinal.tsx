/**
 * SceneFinal.tsx — S7 + S8 合并序列：礼成定格 + 三层文字叠加
 *
 * S7 [690-810]  囍字正式合影，静止展示，四角宫灯亮起
 * S8 [810-900]  同一画面上叠加三层文字：
 *   - 主题大字「缘定今生」（书法体，浮入+弹跳）
 *   - 新人姓名（宋体 Bold，两侧汇聚）
 *   - 婚礼日期（楷体，淡入）
 *   - 金色光尘粒子飘落
 */

import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  Easing,
} from "remotion";
import { PhotoFrame } from "../components/PhotoFrame";
import { FinalTitle } from "../components/FinalTitle";
import { NamesLine } from "../components/NamesLine";
import { DateLine } from "../components/DateLine";
import { GoldDust } from "../components/GoldDust";
import { TOTAL_FRAMES, S7_START, S8_TEXT_START, NAMES_OFFSET, DATE_OFFSET, FADE_OUT_START } from "../timeline";
import type { WeddingProps } from "../props";

interface SceneFinalProps {
  photoSrc: string;
  weddingProps: WeddingProps;
}

export const SceneFinal: React.FC<SceneFinalProps> = ({
  photoSrc,
  weddingProps,
}) => {
  const frame = useCurrentFrame();

  // 相对于 S7_START 的局部帧
  const localFrame = frame - S7_START;

  // ── 全局淡出（最后 15 帧 / 0.5s）──
  const fadeOutOpacity =
    frame >= FADE_OUT_START
      ? interpolate(frame, [FADE_OUT_START, TOTAL_FRAMES], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.in(Easing.cubic),
        })
      : 1;

  // ── S8 文字层时间窗口判断 ──
  const showTitle = frame >= S8_TEXT_START;
  const showNames = frame >= S7_START + NAMES_OFFSET;
  const showDate = frame >= S7_START + DATE_OFFSET;

  return (
    <AbsoluteFill style={{ opacity: fadeOutOpacity }}>
      {/* 底层：囍字正式合影（全时长静止） */}
      <PhotoFrame src={photoSrc} fullWidth>

        {/* S8 文字叠加层 */}
        {showTitle && (
          <FinalTitle
            text="缘定今生"
            startOffset={S8_TEXT_START - S7_START}
          />
        )}

        {showNames && (
          <NamesLine
            text={`${weddingProps.groomName} & ${weddingProps.brideName}`}
            startOffset={NAMES_OFFSET}
          />
        )}

        {showDate && (
          <DateLine
            text={weddingProps.weddingDate}
            startOffset={DATE_OFFSET}
          />
        )}

        {/* 金色光尘 — S6 结束后开始飘落 */}
        <GoldDust startFrame={S7_START + 30} />
      </PhotoFrame>
    </AbsoluteFill>
  );
};
