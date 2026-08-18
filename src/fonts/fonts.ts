/**
 * fonts.ts — 字体配置
 *
 * 使用系统字体 fallback 链，无需加载外部字体文件。
 * 确保在 Remotion 渲染环境中不会因字体下载而超时。
 *
 * 字体优先级：
 *   1. 自定义字体名（若已通过 @font-face 加载）
 *   2. macOS 中文系统字体
 *   3. 通用中文回退
 */

/** 字体族名常量 */
export const FONT_FAMILY = {
  /** 书法体 — 用于 S8 主题大字「缘定今生」 */
  calligraphy: "'STXingkai', 'Kaiti SC', '楷体', 'KaiTi', serif",
  /** 宋体 Bold — 用于 S8 新人姓名 */
  serif: "'Songti SC', 'SimSun', '宋体', 'Serif', serif",
  /** 楷体 Regular — 用于 S8 婚礼日期 + 情绪字幕 */
  kai: "'STKaiti', 'Kaiti SC', '楷体', 'KaiTi', serif",
} as const;

/** 占位导出（保持接口兼容） */
export const FONTS = {
  calligraphy: "",
  serif: "",
  kai: "",
} as const;
