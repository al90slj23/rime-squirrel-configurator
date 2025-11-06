#!/bin/bash

# Rime 鼠须管配置一键部署脚本
# 自动查找下载目录中最新的 rime-config-*.zip 并部署

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Rime 配置一键部署脚本${NC}"
echo ""

# 查找下载目录中最新的 rime-config-*.zip 文件
DOWNLOAD_DIR="$HOME/Downloads"
CONFIG_FILE=$(find "$DOWNLOAD_DIR" -name "rime-config-*.zip" -type f -print0 | xargs -0 ls -t | head -n 1)

if [ -z "$CONFIG_FILE" ]; then
    echo -e "${RED}❌ 错误: 在下载目录中未找到 rime-config-*.zip 文件${NC}"
    echo -e "${YELLOW}请先在配置器中下载配置包${NC}"
    exit 1
fi

echo -e "${GREEN}✓ 找到配置文件: $(basename "$CONFIG_FILE")${NC}"

# 检查 Rime 目录
RIME_DIR="$HOME/Library/Rime"
if [ ! -d "$RIME_DIR" ]; then
    echo -e "${YELLOW}⚠ Rime 目录不存在，正在创建...${NC}"
    mkdir -p "$RIME_DIR"
fi

# 创建临时目录
TEMP_DIR=$(mktemp -d)
echo -e "${GREEN}✓ 创建临时目录: $TEMP_DIR${NC}"

# 解压配置文件
echo -e "${GREEN}📦 正在解压配置文件...${NC}"
unzip -q "$CONFIG_FILE" -d "$TEMP_DIR"

# 复制文件到 Rime 目录
echo -e "${GREEN}📋 正在复制配置文件到 $RIME_DIR...${NC}"
cp -v "$TEMP_DIR"/* "$RIME_DIR/"

# 清理临时目录
rm -rf "$TEMP_DIR"
echo -e "${GREEN}✓ 清理临时文件${NC}"

# 重新部署 Rime
echo -e "${GREEN}🔄 正在重新部署 Rime...${NC}"
if [ -f "/Library/Input Methods/Squirrel.app/Contents/MacOS/Squirrel" ]; then
    "/Library/Input Methods/Squirrel.app/Contents/MacOS/Squirrel" --reload
    echo -e "${GREEN}✅ 部署完成！${NC}"
else
    echo -e "${YELLOW}⚠ 未找到鼠须管，请手动在输入法菜单中点击「重新部署」${NC}"
fi

echo ""
echo -e "${GREEN}🎉 配置已成功部署到 Rime！${NC}"
echo -e "${YELLOW}提示: 如果输入法未立即生效，请在菜单栏选择「鼠须管」→「重新部署」${NC}"
