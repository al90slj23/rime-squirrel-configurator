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

# 使用 Python 生成配置文件
python3 << 'PYTHON_EOF'
import json, sys, os

config = json.loads(os.environ.get('CONFIG_JSON', '{}'))

rime_dir = os.path.expanduser("~/Library/Rime")
schema = config.get('schema', 'luna_pinyin')

# 生成方案配置
schema_config = {
    'patch': {
        'schema': {
            'name': '朙月拼音（簡體優先）' if config.get('simpDefault') == 1 else '朙月拼音（繁體優先）',
            'description': '快速部署配置'
        },
        'switches': [
            {'name': 'ascii_mode', 'reset': 0 if config.get('asciiMode') else 1, 'states': [' 中文', ' 西文']},
            {'name': 'full_shape', 'reset': 1 if config.get('fullShape') else 0, 'states': [' 半角', ' 全角']},
            {'name': 'simplification', 'reset': config.get('simpDefault', 1), 'states': [' 简体', ' 繁體']},
            {'name': 'ascii_punct', 'reset': 0 if config.get('asciiPunct') else 1, 'states': [' 。，', ' ．，']}
        ],
        'switcher': {
            'caption': '方案選單',
            'hotkeys': [config.get('hotkeySwitch', 'Control+Shift')],
            'abbreviate_options': True,
            'option_list_separator': '／'
        },
        'key_binder': {
            'import_preset': 'default',
            'bindings': [
                {'when': 'composing', 'accept': config.get('hotkey', 'Control+Shift+F'), 'toggle': 'simplification'},
                {'when': 'always', 'accept': config.get('hotkeyAscii', 'Shift_L'), 'toggle': 'ascii_mode'},
                {'when': 'always', 'accept': config.get('hotkeyFullShape', 'Control+space'), 'toggle': 'full_shape'}
            ]
        },
        'menu': {
            'alternative_select_labels': config.get('selectLabels', ['1','2','3','4','5','6','7','8','9']),
            'page_size': config.get('pageSize', 6)
        }
    }
}

# 添加 Emoji 和农历开关
if config.get('enableEmoji'):
    schema_config['patch']['switches'].append({'name': 'emoji', 'reset': 1, 'states': ['🈚️', '🈶️']})
if config.get('enableLunar'):
    schema_config['patch']['switches'].append({'name': 'lunar', 'reset': 0, 'states': ['☀️', '🌙']})

# 标点符号
if config.get('enablePunctuator', True):
    schema_config['patch']['punctuator'] = {'import_preset': 'default'}

# ASCII Composer
if config.get('asciiComposer', True):
    schema_config['patch']['ascii_composer'] = {
        'good_old_caps_lock': True,
        'switch_key': {'Caps_Lock': config.get('hotkeyCapsLock', 'Caps_Lock')}
    }

# 识别器
patterns = {}
if config.get('enableEmail', True):
    patterns['email'] = "^[A-Za-z][-_.0-9A-Za-z]*@.*$"
if config.get('enableUrl', True):
    patterns['url'] = "^(www[.]|https?:|ftp[.:]|mailto:|file:).*$|^[a-z]+[.].+$"
if config.get('enableUppercase', True):
    patterns['uppercase'] = "[A-Z][-_+.'0-9A-Za-z]*$"
if patterns:
    schema_config['patch']['recognizer'] = {'patterns': patterns}

# Emoji 和农历引擎
if config.get('enableEmoji') or config.get('enableLunar'):
    translators = ['punct_translator', 'script_translator']
    if config.get('enableEmoji'):
        translators.append('table_translator@emoji')
    if config.get('enableLunar'):
        translators.extend(['lua_translator@date_translator', 'lua_translator@lunar_translator'])
    schema_config['patch']['engine/translators'] = translators

# Emoji 配置
if config.get('enableEmoji'):
    schema_config['patch']['emoji'] = {
        'dictionary': 'emoji',
        'enable_completion': False,
        'prefix': '/',
        'suffix': '/',
        'tips': '〔表情〕',
        'tag': 'emoji'
    }

# 农历识别
if config.get('enableLunar'):
    if 'recognizer' not in schema_config['patch']:
        schema_config['patch']['recognizer'] = {'patterns': {}}
    schema_config['patch']['recognizer']['patterns']['date'] = "^rq$"
    schema_config['patch']['recognizer']['patterns']['lunar'] = "^nl$"

# 符号输入
if config.get('enableSymbols', True):
    schema_config['patch']['punctuator/symbols'] = {
        '/blx': ['~', '～', '〜', '∼', '≈', '≋', '≃', '≅', '⁓', '〰'],
        '/ydy': ['≈'],
        '/zs': ['↑', '↓', '←', '→', '↖', '↗', '↙', '↘', '↔', '↕']
    }

# 写入方案配置
import yaml
schema_file = os.path.join(rime_dir, f"{schema}.custom.yaml")
with open(schema_file, 'w', encoding='utf-8') as f:
    yaml.dump(schema_config, f, allow_unicode=True, default_flow_style=False)
print(f"📝 写入方案配置: {schema}.custom.yaml")

# 生成皮肤配置
squirrel_config = {
    'patch': {
        'style': {
            'color_scheme': config.get('colorScheme', 'lost_temple'),
            'color_scheme_dark': config.get('colorSchemeDark', 'nord'),
            'font_face': config.get('fontFace', ''),
            'font_point': config.get('fontSize', 18),
            'corner_radius': config.get('cornerRadius', 10),
            'line_spacing': config.get('lineSpacing', 6),
            'spacing': config.get('spacing', 8),
            'inline_preedit': config.get('inlinePreedit', False)
        }
    }
}

if config.get('candidateLayout') == 'horizontal':
    squirrel_config['patch']['style']['horizontal'] = True

squirrel_file = os.path.join(rime_dir, "squirrel.custom.yaml")
with open(squirrel_file, 'w', encoding='utf-8') as f:
    yaml.dump(squirrel_config, f, allow_unicode=True, default_flow_style=False)
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

PYTHON_EOF

# 重新部署
echo "🔄 重新部署 Rime..."
if [ -f "/Library/Input Methods/Squirrel.app/Contents/MacOS/Squirrel" ]; then
  "/Library/Input Methods/Squirrel.app/Contents/MacOS/Squirrel" --reload
  echo "✅ 部署完成！"
else
  echo "⚠️ 未找到鼠须管，请手动在输入法菜单中点击「重新部署」"
fi
