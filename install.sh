#!/bin/bash
# Rime 鼠须管一键部署脚本 v2.0
# 支持完整配置传递
# 使用方法: curl -fsSL https://raw.githubusercontent.com/al90slj23/rime-squirrel-configurator/main/install.sh | bash -s -- --config <base64_json>

set -e

CONFIG_B64=""

# 解析参数
while [[ $# -gt 0 ]]; do
  case $1 in
    --config)
      CONFIG_B64="$2"
      shift 2
      ;;
    *)
      echo "未知参数: $1"
      exit 1
      ;;
  esac
done

if [ -z "$CONFIG_B64" ]; then
  echo "❌ 错误：缺少配置参数"
  echo "使用方法: bash install.sh --config <base64_encoded_json>"
  exit 1
fi

echo "🚀 开始部署 Rime 配置..."
RIME_DIR="$HOME/Library/Rime"
mkdir -p "$RIME_DIR"

# 解码配置
echo "📋 解析配置..."
CONFIG_JSON=$(echo "$CONFIG_B64" | base64 -d | python3 -c "import sys, urllib.parse; print(urllib.parse.unquote(sys.stdin.read()))")

# 设置环境变量供 Python 使用
export CONFIG_JSON

# 使用 Python 生成配置文件（无需 PyYAML 依赖）
python3 << 'PYTHON_EOF'
import json, sys, os

config = json.loads(os.environ.get('CONFIG_JSON', '{}'))
rime_dir = os.path.expanduser("~/Library/Rime")
schema = config.get('schema', 'luna_pinyin')

# 手动生成 YAML（无需 PyYAML 库）
def to_yaml(data, indent=0):
    """简单的 YAML 生成器"""
    lines = []
    prefix = '  ' * indent

    if isinstance(data, dict):
        for key, value in data.items():
            if isinstance(value, (dict, list)):
                lines.append(f"{prefix}{key}:")
                lines.append(to_yaml(value, indent + 1))
            elif isinstance(value, bool):
                lines.append(f"{prefix}{key}: {str(value).lower()}")
            elif isinstance(value, str):
                # 处理包含特殊字符的字符串
                if any(c in value for c in [':', '#', '[', ']', '{', '}', '\n']):
                    lines.append(f"{prefix}{key}: '{value}'")
                else:
                    lines.append(f"{prefix}{key}: {value}")
            else:
                lines.append(f"{prefix}{key}: {value}")
    elif isinstance(data, list):
        for item in data:
            if isinstance(item, dict):
                first_key = True
                for key, value in item.items():
                    if first_key:
                        if isinstance(value, list):
                            lines.append(f"{prefix}- {key}:")
                            for v in value:
                                lines.append(f"{prefix}  - {v}")
                        else:
                            lines.append(f"{prefix}- {key}: {value}")
                        first_key = False
                    else:
                        lines.append(f"{prefix}  {key}: {value}")
            else:
                lines.append(f"{prefix}- {item}")

    return '\n'.join(lines)

# 构建方案配置
schema_name = '朙月拼音（簡體優先）' if config.get('simpDefault') == 1 else '朙月拼音（繁體優先）'

switches = [
    {'name': 'ascii_mode', 'reset': 0 if config.get('asciiMode') else 1, 'states': [' 中文', ' 西文']},
    {'name': 'full_shape', 'reset': 1 if config.get('fullShape') else 0, 'states': [' 半角', ' 全角']},
    {'name': 'simplification', 'reset': config.get('simpDefault', 1), 'states': [' 简体', ' 繁體']},
    {'name': 'ascii_punct', 'reset': 0 if config.get('asciiPunct') else 1, 'states': [' 。，', ' ．，']}
]

if config.get('enableEmoji'):
    switches.append({'name': 'emoji', 'reset': 1, 'states': ['🈚️', '🈶️']})
if config.get('enableLunar'):
    switches.append({'name': 'lunar', 'reset': 0, 'states': ['☀️', '🌙']})

# 生成方案 YAML
schema_yaml = f"""patch:
  schema:
    name: {schema_name}
    description: 快速部署配置

  switches:
"""

for sw in switches:
    schema_yaml += f"    - name: {sw['name']}\n"
    schema_yaml += f"      reset: {sw['reset']}\n"
    schema_yaml += f"      states: [{', '.join(sw['states'])}]\n"

schema_yaml += f"""
  switcher:
    caption: 方案選單
    hotkeys:
      - {config.get('hotkeySwitch', 'Control+Shift')}
    abbreviate_options: true
    option_list_separator: ／

  key_binder:
    import_preset: default
    bindings:
      - {{when: composing, accept: {config.get('hotkey', 'Control+Shift+F')}, toggle: simplification}}
      - {{when: always, accept: {config.get('hotkeyAscii', 'Shift_L')}, toggle: ascii_mode}}
      - {{when: always, accept: {config.get('hotkeyFullShape', 'Control+space')}, toggle: full_shape}}

  menu:
    page_size: {config.get('pageSize', 6)}
"""

# 添加选择标签
if config.get('selectLabels'):
    labels = ', '.join(config['selectLabels'])
    schema_yaml += f"    alternative_select_labels: [{labels}]\n"

# 标点符号
if config.get('enablePunctuator', True):
    schema_yaml += "\n  punctuator:\n    import_preset: default\n"

# ASCII Composer
if config.get('asciiComposer', True):
    schema_yaml += f"""
  ascii_composer:
    good_old_caps_lock: true
    switch_key:
      Caps_Lock: {config.get('hotkeyCapsLock', 'Caps_Lock')}
"""

# 识别器
patterns = []
# 添加符号输入的识别模式
if config.get('enableSymbols', True):
    patterns.append("punct: \"^/([a-z]+|[a-z]*[0-9]+)$\"")
if config.get('enableEmail', True):
    patterns.append("email: \"^[A-Za-z][-_.0-9A-Za-z]*@.*$\"")
if config.get('enableUrl', True):
    patterns.append("url: \"^(www[.]|https?:|ftp[.:]|mailto:|file:).*$|^[a-z]+[.].+$\"")
if config.get('enableUppercase', True):
    patterns.append("uppercase: \"[A-Z][-_+.'0-9A-Za-z]*$\"")

if patterns or config.get('enableLunar'):
    schema_yaml += "\n  recognizer:\n    patterns:\n"
    for p in patterns:
        schema_yaml += f"      {p}\n"
    if config.get('enableLunar'):
        schema_yaml += "      date: \"^rq$\"\n"
        schema_yaml += "      lunar: \"^nl$\"\n"

# 引擎配置 - 需要 punct_translator 来处理符号输入
if config.get('enableSymbols', True) or config.get('enableEmoji') or config.get('enableLunar'):
    schema_yaml += "\n  engine/translators:\n"
    schema_yaml += "    - punct_translator\n"
    schema_yaml += "    - script_translator\n"
    if config.get('enableEmoji'):
        schema_yaml += "    - table_translator@emoji\n"
    if config.get('enableLunar'):
        schema_yaml += "    - lua_translator@date_translator\n"
        schema_yaml += "    - lua_translator@lunar_translator\n"

# Emoji 配置
if config.get('enableEmoji'):
    schema_yaml += """
  emoji:
    dictionary: emoji
    enable_completion: false
    prefix: /
    suffix: /
    tips: 〔表情〕
    tag: emoji
"""

# 配置斜杠标点（确保斜杠在第一位）
schema_yaml += """
  punctuator/half_shape:
    /: [/, ／, \\, ÷, 、]
"""

# 符号输入
if config.get('enableSymbols', True):
    schema_yaml += """
  punctuator/symbols:
    /: [/, ／, \\, ÷]
    /blx: [~, ～, 〜, ∼, ≈, ≋, ≃, ≅, ⁓, 〰]
    /ydy: [≈]
    /zs: [↑, ↓, ←, →, ↖, ↗, ↙, ↘, ↔, ↕]
    /jt: [↑, ↓, ←, →, ↖, ↗, ↙, ↘, ↔, ↕]
    /bz: [$, ¥, €, £, ¢, ₩]
    /dh: [①, ②, ③, ④, ⑤, ⑥, ⑦, ⑧, ⑨, ⑩]
"""

# 应用级控制
if config.get('appOptions'):
    app_list = [line.strip() for line in config['appOptions'].split('\n') if line.strip() and not line.strip().startswith('#')]
    if app_list:
        schema_yaml += "\n  app_options:\n"
        for bundle_id in app_list:
            schema_yaml += f"    {bundle_id}:\n"
            schema_yaml += "      ascii_mode: true\n"

# 写入方案配置
schema_file = os.path.join(rime_dir, f"{schema}.custom.yaml")
with open(schema_file, 'w', encoding='utf-8') as f:
    f.write(schema_yaml)
print(f"📝 写入方案配置: {schema}.custom.yaml")

# 生成皮肤配置 YAML
squirrel_yaml = f"""patch:
  style:
    color_scheme: {config.get('colorScheme', 'lost_temple')}
    color_scheme_dark: {config.get('colorSchemeDark', 'nord')}
"""

if config.get('fontFace'):
    squirrel_yaml += f"    font_face: {config['fontFace']}\n"

squirrel_yaml += f"""    font_point: {config.get('fontSize', 18)}
    corner_radius: {config.get('cornerRadius', 10)}
    line_spacing: {config.get('lineSpacing', 6)}
    spacing: {config.get('spacing', 8)}
    inline_preedit: {str(config.get('inlinePreedit', False)).lower()}
"""

if config.get('candidateLayout') == 'horizontal':
    squirrel_yaml += "    horizontal: true\n"

squirrel_file = os.path.join(rime_dir, "squirrel.custom.yaml")
with open(squirrel_file, 'w', encoding='utf-8') as f:
    f.write(squirrel_yaml)
print("🎨 写入皮肤配置: squirrel.custom.yaml")

# Emoji 词库（简化版）
if config.get('enableEmoji'):
    emoji_dict = """# Rime dictionary
# encoding: utf-8
---
name: emoji
version: "1.0"
sort: by_weight
...
😀\t:)\t1
😃\t:D\t1
😄\tgrin\t1
👍\t+1\t1
❤️\theart\t1
"""
    emoji_file = os.path.join(rime_dir, "emoji.dict.yaml")
    with open(emoji_file, 'w', encoding='utf-8') as f:
        f.write(emoji_dict)
    print("😀 写入 Emoji 词库: emoji.dict.yaml")

# Lua 脚本（简化版）
if config.get('enableEmoji') or config.get('enableLunar'):
    rime_lua = "-- Rime Lua 脚本\n"
    if config.get('enableLunar'):
        rime_lua += """
function date_translator(input)
  local date = os.date("*t")
  return {{ text = string.format("%d年%d月%d日", date.year, date.month, date.day), comment = "阳历" }}
end

function lunar_translator(input)
  return {}
end
"""
    lua_file = os.path.join(rime_dir, "rime.lua")
    with open(lua_file, 'w', encoding='utf-8') as f:
        f.write(rime_lua)
    print("🔧 写入 Lua 脚本: rime.lua")

# 自定义短语
if config.get('customPhrases'):
    custom_phrases = config['customPhrases'].strip()
    if custom_phrases:
        # 解析自定义短语，格式：编码<tab>文本
        # custom_phrase.txt 格式：文本<tab>编码
        custom_phrase_txt = "# Rime table\n"
        custom_phrase_txt += "# coding: utf-8\n"
        custom_phrase_txt += "#@/db_name custom_phrase.txt\n"
        custom_phrase_txt += "#@/db_type tabledb\n\n"

        for line in custom_phrases.split('\n'):
            line = line.strip()
            if line and not line.startswith('#'):
                parts = line.split('\t')
                if len(parts) >= 2:
                    code = parts[0].strip()
                    text = parts[1].strip()
                    if code and text:
                        custom_phrase_txt += f"{text}\t{code}\n"

        custom_phrase_file = os.path.join(rime_dir, "custom_phrase.txt")
        with open(custom_phrase_file, 'w', encoding='utf-8') as f:
            f.write(custom_phrase_txt)
        print("✏️ 写入自定义短语: custom_phrase.txt")

PYTHON_EOF

# 重新部署
echo "🔄 重新部署 Rime..."
if [ -f "/Library/Input Methods/Squirrel.app/Contents/MacOS/Squirrel" ]; then
  "/Library/Input Methods/Squirrel.app/Contents/MacOS/Squirrel" --reload
  echo "✅ 部署完成！"
else
  echo "⚠️ 未找到鼠须管，请手动在输入法菜单中点击「重新部署」"
fi
