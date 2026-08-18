import React from "react";
import { Composition, registerRoot, RemotionRoot } from "remotion";

/**
 * 最小化 Root - 用于调试渲染超时问题
 */
const MinimalRoot: React.FC = () => {
  return (
    <RemotionRoot>
      <Composition
        id="minimal-test"
        component={() => (
          <div
            style={{
              width: 1920,
              height: 1080,
              backgroundColor: "#C41E3A",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <span style={{ color: "#D4AF37", fontSize: 120 }}>
              TEST OK
            </span>
          </div>
        )}
        durationInFrames={30}
        fps={30}
        width={1920}
        height={1080}
      />
    </RemotionRoot>
  );
};

// 直接注册，不使用默认导出
registerRoot(MinimalRoot);
