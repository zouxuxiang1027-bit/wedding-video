# Remotion 3.x 视频渲染环境 (Linux/amd64)
# 基于 Node.js 18 LTS + Chrome/Chromium 兼容版本

FROM node:18-bullseye-slim

# 安装系统依赖
RUN apt-get update && apt-get install -y \
    curl \
    git \
    ffmpeg \
    # Chromium 及其依赖
    chromium \
    fonts-noto-cjk \
    fonts-wqy-zenhei \
    && rm -rf /var/lib/apt/lists/*

# 设置 Chromium 路径（Puppeteer 默认查找路径）
ENV CHROME_PATH=/usr/bin/chromium
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

# 创建工作目录
WORKDIR /app

# 复制 package 文件
COPY package.json package-lock.json* ./

# 安装 npm 依赖（使用 npm ci 确保一致性）
RUN npm install --legacy-peer-deps

# 复制项目源码
COPY . .

# 创建输出目录
RUN mkdir -p /app/out

# 暴露端口（用于 Studio 预览）
EXPOSE 3000

# 默认命令：渲染婚礼视频
CMD ["npx", "remotion", "render", "wedding-opening", "out/video.mp4", "--concurrency=2"]
