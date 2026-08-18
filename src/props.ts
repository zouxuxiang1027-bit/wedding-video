import React from "react";

/** Composition defaultProps 类型 */
export interface WeddingProps {
  groomName: string;
  brideName: string;
  weddingDate: string;
}

/** 单个分镜场景的配置 */
export interface SceneConfig {
  photoSrc: string; // staticFile 路径
  durationInFrames: number;
  caption?: string; // 情绪字幕文本（S2-S6）
  captionPosition?: "bottom-left" | "bottom-right" | "bottom-center" | "top-center";
  kenBurnsType?: "push-in" | "pan-left" | "spotlight" | "heartbeat" | "rotate";
  kenBurnsParams?: {
    scaleFrom: number;
    scaleTo: number;
    translateXFrom?: number;
    translateXTo?: number;
    translateYFrom?: number;
    translateYTo?: number;
    rotateFrom?: number;
    rotateTo?: number;
  };
  /** 是否需要暗角/聚光灯效果 */
  vignette?: boolean;
}
