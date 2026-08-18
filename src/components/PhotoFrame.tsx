/**
 * PhotoFrame.tsx — 竖版照片 16:9 信箱化垫底容器
 *
 * 将竖版（portrait）照片居中显示在 16:9 画幅内，
 * 左右/上下填充暗红渐变，避免拉伸变形。
 */

import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { DARK_RED, LETTERBOX_LEFT, LETTERBOX_RIGHT } from "../palette";

interface PhotoFrameProps {
  /** staticFile 路径，如 'photos/photo-02.jpeg' */
  src: string;
  /** 子元素（如字幕层） */
  children?: React.ReactNode;
  /** 是否全幅显示（接近 16:9 的横版照片可设为 true 减少垫底） */
  fullWidth?: boolean;
}

export const PhotoFrame: React.FC<PhotoFrameProps> = ({
  src,
  children,
  fullWidth = false,
}) => {
  const photoSrc = staticFile(src);

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_RED }}>
      {/* 照片区域 */}
      <AbsoluteFill
        style={{
          left: fullWidth ? "0%" : "15%",
          width: fullWidth ? "100%" : "70%",
          overflow: "hidden",
        }}
      >
        <Img
          src={photoSrc}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </AbsoluteFill>

      {/* 暗红渐变垫底（仅非全幅模式） */}
      {!fullWidth && (
        <>
          <AbsoluteFill
            style={{
              left: 0,
              width: "15%",
              background: LETTERBOX_LEFT,
              pointerEvents: "none",
            }}
          />
          <AbsoluteFill
            style={{
              right: 0,
              width: "15%",
              background: LETTERBOX_RIGHT,
              pointerEvents: "none",
            }}
          />
        </>
      )}

      {/* 叠加层（字幕等） */}
      {children}
    </AbsoluteFill>
  );
};
