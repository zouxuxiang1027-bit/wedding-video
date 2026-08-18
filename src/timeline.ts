/**
 * timeline.ts — V2 脚本分镜帧区间与照片映射（单一数据源）
 *
 * 总时长：900 帧 = 30 秒 @ 30fps
 * 照片编号对应 public/photos/photo-XX.jpeg
 * 编号映射：
 *   #1=并坐持扇  #2=额头吻  #3=牵手立姿  #4=新娘团扇
 *   #5=新郎囍字  #6=缓步前行  #7=囍字合影  #8=作揖行礼(彩蛋)
 *   #9=分坐端正  #10=比心  #11=搞怪互指(彩蛋)
 */

// ─── 帧区间常量 ──────────────────────────────────────

/** S1 开场钩子 [0, 90] — 3s */
export const S1_START = 0;
export const S1_END = 90;

/** S2 新娘亮相 [90, 210] — 4s */
export const S2_START = 90;
export const S2_END = 210;

/** S3 新郎登场 [210, 330] — 4s */
export const S3_START = 210;
export const S3_END = 330;

/** S4 初见牵手 [330, 420] — 3s + 12f 补偿交叉溶解 = 102f duration */
export const S4_START = 330;
export const S4_END = 420; // 视觉终点不变
export const S4_DURATION = 102; // 含 transition 重叠补偿

/** S5a 同行岁月·主 [420, 495] — 4.5s + 24f 补偿叠化 = 99f duration */
export const S5A_START = 420;
export const S5A_END = 495; // 叠化中点
export const S5A_DURATION = 99;

/** S5b 同行岁月·叠入 [495, 570] — 2.5s */
export const S5B_START = 495;
export const S5B_END = 570;
export const S5B_DURATION = 75;

/** S6 甜蜜时刻 [570, 690] — 4s */
export const S6_START = 570;
export const S6_END = 690;

/** S7+S8 礼成+收尾 [690, 900] — 7s 合并序列（无切换） */
export const S7_START = 690;
export const S8_TEXT_START = 810; // S8 三层文字开始浮现
export const TOTAL_FRAMES = 900;

// ─── 转场参数 ──────────────────────────────────────

export const TRANSITIONS = {
  /** S1→S2 光晕溶解 Overlay: 15f (0.5s) */
  glowDissolve: { durationInFrames: 15 },
  /** S2→S3 柔光横向推移 Overlay: 15f (0.5s) */
  softPanH: { durationInFrames: 15 },
  /** S3→S4 闪光溶解 Overlay: 9f (0.3s) */
  flashDissolve: { durationInFrames: 9 },
  /** S4→S5a 交叉溶解 Transition: 12f (0.4s) — 会压缩时长 */
  crossFade_S4S5a: { durationInFrames: 12 },
  /** S5a→S5b 叠化 Transition: 24f (0.8s) — 会压缩时长 */
  crossFade_S5aS5b: { durationInFrames: 24 },
  /** S5b→S6 柔光扩散 Overlay: 15f (0.5s) */
  softSpread: { durationInFrames: 15 },
  /** S6→S7 金色光幕 Overlay: 15f (0.5s) */
  goldCurtain: { durationInFrames: 15 },
} as const;

// ─── 照片映射表 ──────────────────────────────────────

/** 分镜编号 → public/photos/ 文件名 */
export const PHOTO_MAP: Record<string, string> = {
  S1: "photo-02.jpeg", // #2 额头吻
  S2: "photo-04.jpeg", // #4 新娘团扇
  S3: "photo-05.jpeg", // #5 新郎囍字
  S4: "photo-03.jpeg", // #3 牵手立姿
  S5a: "photo-06.jpeg", // #6 缓步前行
  S5b: "photo-01.jpeg", // #1 并坐优雅
  S6: "photo-10.jpeg", // #10 比心
  S7: "photo-07.jpeg", // #7 囍字合影（S7+S8 共用）
};

// 彩蛋备选
export const PHOTO_BONUS: Record<string, string> = {
  bonus1: "photo-08.jpeg", // #8 作揖行礼
  bonus2: "photo-09.jpeg", // #9 分坐端正
  bonus3: "photo-11.jpeg", // #11 搞怪互指
};

// ─── 字幕文案 ──────────────────────────────────────

export const CAPTIONS: Record<string, { text: string; font?: string }> = {
  S2: { text: "倾城之貌" },
  S3: { text: "翩翩君子" },
  S4: { text: "执子之手" },
  S5a: { text: "与子偕老" },
  S5b: { text: "岁月静好" },
  S6: { text: "此生唯你" }, // 用圆润字体做反差萌
};

// ─── S8 文字层时间偏移（相对 S7_START）─────────────

/** 主题大字「缘定今生」浮入起始帧（相对 S7_START 的偏移） */
export const FINAL_TITLE_OFFSET = 120; // 即全局 810 帧
/** 姓名汇聚起始帧（比主题晚 9 帧 / 0.3s） */
export const NAMES_OFFSET = 129; // 即全局 819 帧
/** 日期淡入起始帧（最晚，比主题晚 30 帧 / 1s） */
export const DATE_OFFSET = 150; // 即全局 840 帧
/** 全局淡出起始帧（最后 0.5s = 15 帧） */
export const FADE_OUT_START = 885;
