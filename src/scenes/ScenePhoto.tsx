/**
 * ScenePhoto.tsx — 通用单照片场景（S1–S6）
 *
 * 组合 PhotoFrame + KenBurns + Caption，
 * 通过 props 配置不同分镜的运镜和字幕。
 */

import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { PhotoFrame } from "../components/PhotoFrame";
import { KenBurns } from "../components/KenBurns";
import { Caption } from "../components/Caption";
import { CAPTIONS } from "../timeline";

interface ScenePhotoProps {
  /** 场景标识，如 'S1' / 'S2' 等 */
  sceneId: string;
  /** 照片 staticFile 路径 */
  photoSrc: string;
  /** 场景总帧数 */
  durationInFrames: number;
  /** 运镜类型 */
  kenBurnsType: import("../components/KenBurns").KenBurnsType;
  /** scale 起止值 */
  scaleFrom?: number;
  scaleTo?: number;
  /** X 平移起止 (%) */
  translateXFrom?: number;
  translateXTo?: number;
  /** Y 平移起止 (%) */
  translateYFrom?: number;
  translateYTo?: number;
  /** 旋转起止 (度) */
  rotateFrom?: number;
  rotateTo?: number;
  /** 是否全幅显示（减少垫底） */
  fullWidth?: boolean;
  /** S1 开场淡入：前 15 帧从黑淡入 */
  fadeIn?: boolean;
}

export const ScenePhoto: React.FC<ScenePhotoProps> = ({
  sceneId,
  photoSrc,
  durationInFrames,
  kenBurnsType,
  scaleFrom = 1.0,
  scaleTo = 1.0,
  translateXFrom = 0,
  translateXTo = 0,
  translateYFrom = 0,
  translateYTo = 0,
  rotateFrom = 0,
  rotateTo = 0,
  fullWidth = false,
  fadeIn = false,
}) => {
  const frame = useCurrentFrame();

  // S1 开场淡入效果
  const opacity =
    !fadeIn || frame >= 15
      ? 1
      : interpolate(frame, [0, 15], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.cubic),
        });

  // 从 CAPTIONS 取字幕配置
  const captionConfig = CAPTIONS[sceneId];

  return (
    <AbsoluteFill style={{ opacity }}>
      <KenBurns
        durationInFrames={durationInFrames}
        type={kenBurnsType}
        scaleFrom={scaleFrom}
        scaleTo={scaleTo}
        translateXFrom={translateXFrom}
        translateXTo={translateXTo}
        translateYFrom={translateYFrom}
        translateYTo={translateYTo}
        rotateFrom={rotateFrom}
        rotateTo={rotateTo}
      >
        <PhotoFrame src={photoSrc} fullWidth={fullWidth}>
          {captionConfig && (
            <Caption
              text={captionConfig.text}
              position={
                sceneId === "S2"
                  ? "bottom-left"
                  : sceneId === "S3"
                    ? "bottom-right"
                    : sceneId === "S4" || sceneId === "S5a"
                      ? "bottom-center"
                      : "top-center"
              }
            />
          )}
        </PhotoFrame>
      </KenBurns>
    </AbsoluteFill>
  );
};
