import React from "react";
import { AbsoluteFill } from "remotion";

/**
 * 最小测试组件 — 验证渲染管线是否正常
 */
export const TestComposition: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#C41E3A",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          fontSize: 80,
          color: "#D4AF37",
          fontFamily: "serif",
          textAlign: "center",
        }}
      >
        缘定今生
      </div>
    </AbsoluteFill>
  );
};
