# 婚礼开场视频 — Remotion 工程项目

## 项目概述

基于 V2 脚本《缘定今生》的 Remotion 4.x 工程代码，用于渲染 30 秒中式婚礼开场视频（横屏 16:9 / 1080p / 30fps）。

## 技术栈

- **Remotion** 4.0.220 — React 视频框架
- **@remotion/transitions** — 转场效果（fade/TransitionSeries）
- **React** 18.3.1 + **TypeScript**
- **中文字体**：马善政书法（MaShanZheng）、思源宋体 SC Bold（NotoSerifSC）、霞鹜文楷（LXGWWenKai）

## 目录结构

```
├── public/
│   ├── fonts/                  # 中文字体文件（woff2）
│   │   ├── MaShanZheng-Regular.woff2    # 书法体（主题大字）
│   │   ├── NotoSerifSC-Bold.woff2       # 宋体（姓名）
│   │   └── LXGWWenKai-Regular.woff2     # 楷体（日期+字幕）
│   ├── photos/
│   │   ├── photo-01~11.jpeg             # 婚纱照（当前为占位图，需替换）
│   │   └── PHOTO_REPLACEMENT_GUIDE.md   # 照片替换指南
│   └── audio/
│       └── bgm-placeholder.wav          # BGM 占位（30s 静音，需替换）
├── src/
│   ├── Root.tsx                 # Remotion 根组件（注册 Composition）
│   ├── index.ts                 # 入口
│   ├── WeddingOpening.tsx       # 主时间轴（TransitionSeries 编排 8 个分镜）
│   ├── timeline.ts              # 帧区间、照片映射、转场参数、字幕文案
│   ├── props.ts                 # 类型定义（WeddingProps / SceneConfig）
│   ├── palette.ts               # 颜色常量（中国红 / 赤金 / 暗红渐变）
│   ├── fonts/fonts.ts           # 字体加载（waitForFonts + FontFace）
│   ├── components/
│   │   ├── PhotoFrame.tsx       # 竖图→16:9 信箱化垫底组件
│   │   ├── KenBurns.tsx         # 运镜工具（推近/平移/聚光灯/心跳脉冲/旋转）
│   │   ├── Caption.tsx          # 情绪字幕（S2-S6 分镜文字）
│   │   ├── FinalTitle.tsx       # S8 主题大字「缘定今生」（浮入+弹跳）
│   │   ├── NamesLine.tsx        # S8 新人姓名（两侧汇聚）
│   │   ├── DateLine.tsx         # S8 婚礼日期（淡入）
│   │   ├── GoldDust.tsx         # 金色光尘粒子效果
│   │   └── effects/
│   │       ├── GlowOverlay.tsx      # 光晕溶解 Overlay
│   │       ├── FlashOverlay.tsx     # 白闪溶解 Overlay
│   │       ├── SoftSpreadOverlay.tsx # 柔光扩散 Overlay
│   │       └── GoldCurtainOverlay.tsx # 金色光幕 Overlay
│   └── scenes/
│       ├── ScenePhoto.tsx       # 通用单照片场景（S1-S6）
│       └── SceneFinal.tsx       # S7+S8 合并收尾场景（合影+三层文字）
├── package.json
├── tsconfig.json
├── remotion.config.ts
└── out/                         # 渲染输出目录
```

## 快速开始

### 1. 安装依赖

```bash
# 依赖已安装到 workspace node_modules（通过符号链接关联）
npm install   # 或使用: cd <workspace> && npm install
```

### 2. 替换照片素材

**必须操作**：将 `public/photos/` 下的占位图替换为真实婚纱照。

详细步骤见：`public/photos/PHOTO_REPLACEMENT_GUIDE.md`

### 3. 替换背景音乐（可选）

将 30 秒左右的 MP3/WAV 文件放入 `public/audio/` 并重命名为 `bgm.mp3`（或修改 WeddingOpening.tsx 中的 Audio src）。

### 4. 自定义文字内容

编辑 `src/Root.tsx` 中的 defaultProps：

```tsx
defaultProps={{
  groomName: "新郎真实姓名",
  brideName: "新娘真实姓名",
  weddingDate: "2026.XX.XX",     // 如 "2026年10月1日"
}}
```

### 5. 启动预览

```bash
npx remotion studio
```

浏览器打开 http://localhost:3000 ，选择 `wedding-opening` 合成即可预览。

### 6. 渲染输出

```bash
npx remotion render wedding-opening out/video.mp4 \
  --concurrency=2 \
  --codec=h264 \
  --pixel-format=yuv420p
```

输出文件：`out/video.mp4`（约 10-30 分钟，取决于机器性能）

## 分镜时间线

| 场景 | 时间 | 照片 | 运镜 | 字幕 | 转场 |
|------|------|------|------|------|------|
| S1 开场 | 0-3s | #2 额头吻 | 极慢推近 100%→108% | — | — (淡入) |
| S2 新娘 | 3-7s | #4 团扇像 | 画卷左移 | 倾城之貌 | 光晕溶解 |
| S3 新郎 | 7-11s | #5 囍字单人 | 聚光灯推近 | 翩翩君子 | 柔光推移 |
| S4 牵手 | 11-14s | #3 牵手立姿 | 心跳脉冲 | 执子之手 | 白闪溶解 |
| S5a 同行 | 14-19s | #6 缓步前行 | 微推近+上移 | 与子偕老 | 交叉溶解 |
| S5b 并坐 | 19-22.5s | #1 并坐优雅 | 推近 102%→108% | 岁月静好 | 叠化 |
| S6 比心 | 22.5-27s | #10 双手比心 | 心跳微缩放 | 此生唯你 | 柔光扩散 |
| S7+S8 收尾 | 27-30s | #7 囍字合影 | 静止 | 缘定今生+姓名+日期 | 金色光幕 |

## 可定制项

| 维度 | 修改位置 | 说明 |
|------|---------|------|
| 新人姓名/日期 | `src/Root.tsx` defaultProps | 全局替换占位符 |
| 照片素材 | `public/photos/photo-XX.jpeg` | 按编号对照表替换 |
| 背景音乐 | `public/audio/` + `WeddingOpening.tsx` | 替换音频文件 |
| 配色方案 | `src/palette.ts` | 修改中国红/赤金色值 |
| 字体样式 | `src/components/FinalTitle.tsx` 等 | 调整字号/间距/动画 |
| 运镜参数 | `src/WeddingOpening.tsx` 各 ScenePhoto props | scale/translate/rotate |
| 输出规格 | `src/Root.tsx` Composition props | width/height/fps/duration |

## 注意事项

1. **中文字体**：`public/fonts/` 下的 woff2 文件必须在——缺失会导致中文显示为方块
2. **照片格式**：竖版照片会自动做信箱化处理（左右暗红渐变垫底），无需手动裁剪
3. **渲染性能**：1080p 30fps 的 900 帧视频在 M1/M2 芯片上约需 10-20 分钟
4. **BGM 版权**：婚礼现场播放请使用已授权音乐，避免版权问题
