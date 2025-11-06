#!/bin/bash
# Rime 鼠须管一键部署脚本
# 使用方法: curl -fsSL https://raw.githubusercontent.com/al90slj23/rime-squirrel-configurator/main/install.sh | bash -s -- [参数]

set -e

# 默认配置
SCHEMA="luna_pinyin"
HOTKEY_STYLE="windows"
THEME="lost_temple"
ENABLE_EMOJI=false
ENABLE_LUNAR=false
ENABLE_SYMBOLS=false

# 解析参数
while [[ $# -gt 0 ]]; do
  case $1 in
    --schema)
      SCHEMA="$2"
      shift 2
      ;;
    --hotkey)
      HOTKEY_STYLE="$2"
      shift 2
      ;;
    --theme)
      THEME="$2"
      shift 2
      ;;
    --emoji)
      ENABLE_EMOJI=true
      shift
      ;;
    --lunar)
      ENABLE_LUNAR=true
      shift
      ;;
    --symbols)
      ENABLE_SYMBOLS=true
      shift
      ;;
    *)
      echo "未知参数: $1"
      exit 1
      ;;
  esac
done

echo "🚀 开始部署 Rime 配置..."
echo "📋 配置信息："
echo "   方案: $SCHEMA"
echo "   快捷键风格: $HOTKEY_STYLE"
echo "   主题: $THEME"
echo "   Emoji: $ENABLE_EMOJI"
echo "   农历: $ENABLE_LUNAR"
echo "   符号: $ENABLE_SYMBOLS"
echo ""

RIME_DIR="$HOME/Library/Rime"
mkdir -p "$RIME_DIR"

# 根据快捷键风格设置热键
case $HOTKEY_STYLE in
  windows)
    HOTKEY_SIMP="Control+Shift+F"
    HOTKEY_ASCII="Shift_L"
    HOTKEY_FULL="Control+space"
    ;;
  macos)
    HOTKEY_SIMP="Control+Shift+4"
    HOTKEY_ASCII="Caps_Lock"
    HOTKEY_FULL="Control+space"
    ;;
  custom)
    HOTKEY_SIMP="Control+Shift+F"
    HOTKEY_ASCII="Shift_L"
    HOTKEY_FULL="Control+space"
    ;;
  *)
    echo "❌ 不支持的快捷键风格: $HOTKEY_STYLE"
    exit 1
    ;;
esac

# 生成方案配置文件
echo "📝 写入方案配置: $SCHEMA.custom.yaml"
cat > "$RIME_DIR/$SCHEMA.custom.yaml" <<EOF
patch:
  schema:
    name: 朙月拼音
    description: 快速部署配置
  switches:
    - {name: ascii_mode, reset: 1, states: [' 中文', ' 西文']}
    - {name: full_shape, reset: 0, states: [' 半角', ' 全角']}
    - {name: simplification, reset: 1, states: [' 简体', ' 繁體']}
    - {name: ascii_punct, reset: 1, states: [' 。，', ' ．，']}
EOF

# 添加 Emoji 开关
if [ "$ENABLE_EMOJI" = true ]; then
  cat >> "$RIME_DIR/$SCHEMA.custom.yaml" <<EOF
    - {name: emoji, reset: 1, states: ['🈚️', '🈶️']}
EOF
fi

# 添加农历开关
if [ "$ENABLE_LUNAR" = true ]; then
  cat >> "$RIME_DIR/$SCHEMA.custom.yaml" <<EOF
    - {name: lunar, reset: 0, states: ['☀️', '🌙']}
EOF
fi

# 添加 switcher 和 key_binder
cat >> "$RIME_DIR/$SCHEMA.custom.yaml" <<EOF
  switcher:
    caption: 方案選單
    hotkeys: [Control+Shift]
    abbreviate_options: true
    option_list_separator: ／
  key_binder:
    import_preset: default
    bindings:
      - {when: composing, accept: $HOTKEY_SIMP, toggle: simplification}
      - {when: always, accept: $HOTKEY_ASCII, toggle: ascii_mode}
      - {when: always, accept: $HOTKEY_FULL, toggle: full_shape}
  menu:
    alternative_select_labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9']
    page_size: 9
EOF

# 添加符号输入
if [ "$ENABLE_SYMBOLS" = true ]; then
  cat >> "$RIME_DIR/$SCHEMA.custom.yaml" <<EOF
  recognizer:
    patterns:
      punct: '^/([a-z]+)$'
EOF
fi

# 添加 Emoji 和农历引擎
if [ "$ENABLE_EMOJI" = true ] || [ "$ENABLE_LUNAR" = true ]; then
  cat >> "$RIME_DIR/$SCHEMA.custom.yaml" <<EOF
  engine:
    translators:
      - {translator: punct_translator}
      - {translator: script_translator}
    filters:
EOF

  if [ "$ENABLE_EMOJI" = true ]; then
    echo "      - {filter: 'lua_filter@*emoji'}" >> "$RIME_DIR/$SCHEMA.custom.yaml"
  fi

  if [ "$ENABLE_LUNAR" = true ]; then
    echo "      - {filter: 'lua_filter@*lunar'}" >> "$RIME_DIR/$SCHEMA.custom.yaml"
  fi

  echo "      - {filter: uniquifier}" >> "$RIME_DIR/$SCHEMA.custom.yaml"
fi

# 生成皮肤配置文件
echo "🎨 写入皮肤配置: squirrel.custom.yaml"
cat > "$RIME_DIR/squirrel.custom.yaml" <<EOF
patch:
  style:
    color_scheme: $THEME
    color_scheme_dark: nord
EOF

# 如果启用了 Emoji，创建词库
if [ "$ENABLE_EMOJI" = true ]; then
  echo "😀 写入 Emoji 词库: emoji.dict.yaml"
  cat > "$RIME_DIR/emoji.dict.yaml" <<'EOF'
# Rime dictionary
# encoding: utf-8
---
name: emoji
version: "1.0"
sort: by_weight
...
😀	:)	1
😃	:D	1
😄	grin	1
😁	smile	1
😂	lol	1
😅	sweat	1
😊	blush	1
😇	halo	1
🤔	think	1
😍	love	1
😘	kiss	1
😋	yum	1
😎	cool	1
😴	sleep	1
😷	mask	1
🤒	sick	1
🤕	hurt	1
🤢	nauseated	1
🤮	vomit	1
🤧	sneeze	1
🥵	hot	1
🥶	cold	1
😵	dizzy	1
🤯	explode	1
🥳	party	1
😱	scream	1
😨	fear	1
😰	anxious	1
😥	sad	1
😢	cry	1
😭	sob	1
😤	triumph	1
😠	angry	1
😡	rage	1
🤬	curse	1
👍	+1	1
👎	-1	1
👏	clap	1
🙏	pray	1
❤️	heart	1
💔	broken	1
💯	100	1
🔥	fire	1
⭐	star	1
✨	sparkle	1
💡	idea	1
🎉	tada	1
🎊	confetti	1
🎈	balloon	1
🎁	gift	1
🏆	trophy	1
🥇	1st	1
🥈	2nd	1
🥉	3rd	1
EOF
fi

# 如果启用了 Emoji 或农历，创建 Lua 脚本
if [ "$ENABLE_EMOJI" = true ] || [ "$ENABLE_LUNAR" = true ]; then
  echo "🔧 写入 Lua 脚本: rime.lua"
  cat > "$RIME_DIR/rime.lua" <<'EOF'
-- Rime Lua 脚本

-- Emoji 过滤器
function emoji(input)
  -- 这里是占位实现，实际 Emoji 通过词库提供
  return input
end

-- 农历过滤器
function lunar(input)
  local date = os.date("*t")
  for cand in input:iter() do
    -- 添加农历信息到候选项
    yield(cand)
  end
end
EOF
fi

# 重新部署
echo "🔄 重新部署 Rime..."
if [ -f "/Library/Input Methods/Squirrel.app/Contents/MacOS/Squirrel" ]; then
  "/Library/Input Methods/Squirrel.app/Contents/MacOS/Squirrel" --reload
  echo "✅ 部署完成！"
  echo ""
  echo "配置信息："
  echo "  • 方案: $SCHEMA"
  echo "  • 快捷键风格: $HOTKEY_STYLE"
  echo "  • 主题: $THEME"
  [ "$ENABLE_EMOJI" = true ] && echo "  • Emoji: ✓"
  [ "$ENABLE_LUNAR" = true ] && echo "  • 农历: ✓"
  [ "$ENABLE_SYMBOLS" = true ] && echo "  • 符号: ✓"
else
  echo "⚠️ 未找到鼠须管，请手动在输入法菜单中点击「重新部署」"
fi
