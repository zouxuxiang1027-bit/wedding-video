import React from "react";
import { Composition } from "remotion";
import { WeddingOpening } from "./WeddingOpening";
import { TestComposition } from "./TestComposition";

/**
 * RemotionRoot — 根组件
 *
 * 注意：不要手动导入并包裹 `RemotionRoot`（Remotion 内部 Provider）。
 * Remotion 渲染入口会自动包裹，手动包裹会导致嵌套 Provider，
 * 使 <Composition> 抛出 "mounted inside another composition" 错误，
 * 页面无法 ready，渲染超时。这里直接用 Fragment 即可。
 */
const RemotionRootComponent: React.FC = () => {
  return (
    <>
      {/* 最小测试组件 */}
      <Composition
        id="test"
        component={TestComposition}
        durationInFrames={90}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* 正式婚礼视频 */}
      <Composition
        id="wedding-opening"
        component={WeddingOpening}
        durationInFrames={900}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          groomName: "【邹旭祥】",
          brideName: "【蔡咏妍】",
          weddingDate: "【2026年9月16日】",
        }}
      />
    </>
  );
};

export const RemotionRoot = RemotionRootComponent;
