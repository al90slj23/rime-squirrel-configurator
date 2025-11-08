// 配置生成模块 - 不依赖全局变量
import { getSimpDefault, getSelectLabels, el } from './utils.js';

// 生成方案配置 YAML
export function renderYaml() {
  const hotkey = el('hotkey');
  const hotkeySwitch = el('hotkeySwitch');
  const hotkeyAscii = el('hotkeyAscii');
  const hotkeyFullShape = el('hotkeyFullShape');
  const hotkeyCapsLock = el('hotkeyCapsLock');
  const asciiMode = el('asciiMode');
  const fullShape = el('fullShape');
  const asciiPunct = el('asciiPunct');
  const pageSize = el('pageSize');
  const asciiComposer = el('asciiComposer');
  const enableEmail = el('enableEmail');
  const enableUrl = el('enableUrl');
  const enableUppercase = el('enableUppercase');
  const enablePunctuator = el('enablePunctuator');
  const enableEmoji = el('enableEmoji');
  const enableLunar = el('enableLunar');
  const enableSymbols = el('enableSymbols');
  const customPhrases = el('customPhrases');
  const appOptions = el('appOptions');

  const hk = (hotkey?.value || '').split(',').map(s => s.trim()).filter(Boolean);

  const yamlObj = {
    patch: {
      schema: {
        name: getSimpDefault() === 1 ? '朙月拼音（簡體優先）' : '朙月拼音（繁體優先）',
        description: (getSimpDefault() === 1
          ? '預設輸出簡體，可用熱鍵在簡繁間切換。'
          : '預設輸出繁體，可用熱鍵在簡繁間切換。')
      },
      switches: [
        { name: 'ascii_mode', reset: asciiMode?.checked ? 0 : 1, states: [' 中文', ' 西文'] },
        { name: 'full_shape', reset: fullShape?.checked ? 1 : 0, states: [' 半角', ' 全角'] },
        { name: 'simplification', reset: getSimpDefault(), states: [' 简体', ' 繁體'] },
        { name: 'ascii_punct', reset: asciiPunct?.checked ? 0 : 1, states: [' 。，', ' ．，'] }
      ].concat(
        enableEmoji?.checked ? [{ name: 'emoji', reset: 1, states: ['🈚️', '🈶️'] }] : [],
        enableLunar?.checked ? [{ name: 'lunar', reset: 0, states: ['☀️', '🌙'] }] : []
      ),
      switcher: {
        caption: '方案選單',
        hotkeys: (hotkeySwitch?.value?.trim() || 'Control+Shift').split(',').map(s => s.trim()).filter(Boolean),
        abbreviate_options: true,
        option_list_separator: '／'
      },
      key_binder: {
        import_preset: 'default',
        bindings: [
          { when: 'composing', accept: (hk[0] || 'Control+Shift+F'), toggle: 'simplification' },
          { when: 'always', accept: (hotkeyAscii?.value?.trim() || 'Shift_L'), toggle: 'ascii_mode' },
          { when: 'always', accept: (hotkeyFullShape?.value?.trim() || 'Control+space'), toggle: 'full_shape' }
        ]
      },
      menu: {
        alternative_select_labels: getSelectLabels(),
        page_size: parseInt(pageSize?.value) || 9
      }
    }
  };

  // Punctuator 标点符号设置
  if (enablePunctuator?.checked) {
    yamlObj.patch.punctuator = { import_preset: 'default' };
  }

  // ASCII composer 设置
  if (asciiComposer?.checked) {
    yamlObj.patch.ascii_composer = {
      good_old_caps_lock: true,
      switch_key: {
        Caps_Lock: hotkeyCapsLock?.value?.trim() || 'Caps_Lock'
      }
    };
  }

  // Recognizer patterns
  const patterns = {};
  if (enableEmail?.checked) {
    patterns.email = "^[A-Za-z][-_.0-9A-Za-z]*@.*$";
  }
  if (enableUrl?.checked) {
    patterns.url = "^(www[.]|https?:|ftp[.:]|mailto:|file:).*$|^[a-z]+[.].+$";
  }
  if (enableUppercase?.checked) {
    patterns.uppercase = "[A-Z][-_+.'0-9A-Za-z]*$";
  }
  if (Object.keys(patterns).length > 0) {
    yamlObj.patch.recognizer = { patterns };
  }

  // Emoji 和农历支持的引擎配置
  if (enableEmoji?.checked || enableLunar?.checked) {
    const translators = ['punct_translator', 'script_translator'];

    if (enableEmoji?.checked) {
      translators.push('table_translator@emoji');
    }
    if (enableLunar?.checked) {
      translators.push('lua_translator@date_translator');
      translators.push('lua_translator@lunar_translator');
    }

    yamlObj.patch['engine/translators'] = translators;
  }

  // Emoji 配置
  if (enableEmoji?.checked) {
    yamlObj.patch.emoji = {
      dictionary: 'emoji',
      enable_completion: false,
      prefix: '/',
      suffix: '/',
      tips: '〔表情〕',
      tag: 'emoji'
    };
  }

  // 农历和日期的识别模式
  if (enableLunar?.checked) {
    if (!yamlObj.patch.recognizer) {
      yamlObj.patch.recognizer = { patterns: {} };
    }
    if (!yamlObj.patch.recognizer.patterns) {
      yamlObj.patch.recognizer.patterns = {};
    }
    yamlObj.patch.recognizer.patterns.date = "^rq$";
    yamlObj.patch.recognizer.patterns.lunar = "^nl$";
  }

  // 符号输入配置
  if (enableSymbols?.checked) {
    yamlObj.patch['punctuator/symbols'] = {
      '/': ['/', '／', '、', '\\'],
      '/blx': ['~', '～', '〜', '∼', '≈', '≋', '≃', '≅', '⁓', '〰'],
      '/ydy': ['≈'],
      '/bdy': ['≠'],
      '/xdy': ['≤', '⩽'],
      '/gdy': ['≥', '⩾'],
      '/jh': ['±', '＋', '－', '×', '÷', '∓'],
      '/wq': ['∞', '∫', '∮', '∑', '∏'],
      '/jh2': ['＝', '≡', '≌', '≈'],
      '/px': ['⊥', '∥', '∠', '⌒', '⊙', '○', '●'],
      '/jj': ['∵', '∴', '∷'],
      '/zs': ['↑', '↓', '←', '→', '↖', '↗', '↙', '↘', '↔', '↕'],
      '/jt': ['↑', '↓', '←', '→', '↖', '↗', '↙', '↘', '↔', '↕'],
      '/sx': ['⇑', '⇓', '⇐', '⇒', '⇖', '⇗', '⇙', '⇘', '⇔', '⇕'],
      '/dh': ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⑩'],
      '/xh': ['⑴', '⑵', '⑶', '⑷', '⑸', '⑹', '⑺', '⑻', '⑼', '⑽'],
      '/xm': ['Ⅰ', 'Ⅱ', 'Ⅲ', 'Ⅳ', 'Ⅴ', 'Ⅵ', 'Ⅶ', 'Ⅷ', 'Ⅸ', 'Ⅹ', 'Ⅺ', 'Ⅻ'],
      '/xxm': ['ⅰ', 'ⅱ', 'ⅲ', 'ⅳ', 'ⅴ', 'ⅵ', 'ⅶ', 'ⅷ', 'ⅸ', 'ⅹ'],
      '/dw': ['°', '℃', '℉', '‰', '‱', '㎡', '㎥', '㎞', '㎏', '㎜'],
      '/bz': ['$', '¥', '€', '£', '¢', '₩'],
      '/hb': ['$', '¥', '€', '£', '¢', '₩'],
      '/xh2': ['※', '★', '☆', '○', '●', '◎', '◇', '◆', '□', '■', '△', '▲', '▽', '▼'],
      '/fh': ['♠', '♣', '♥', '♦'],
      '/ts': ['♩', '♪', '♫', '♬', '♭', '♮', '♯'],
      '/sx2': ['Α', 'Β', 'Γ', 'Δ', 'Ε', 'Ζ', 'Η', 'Θ', 'Ι', 'Κ', 'Λ', 'Μ', 'Ν', 'Ξ', 'Ο', 'Π', 'Ρ', 'Σ', 'Τ', 'Υ', 'Φ', 'Χ', 'Ψ', 'Ω'],
      '/xx': ['α', 'β', 'γ', 'δ', 'ε', 'ζ', 'η', 'θ', 'ι', 'κ', 'λ', 'μ', 'ν', 'ξ', 'ο', 'π', 'ρ', 'σ', 'τ', 'υ', 'φ', 'χ', 'ψ', 'ω'],
      '/py': ['ā', 'á', 'ǎ', 'à', 'ē', 'é', 'ě', 'è', 'ī', 'í', 'ǐ', 'ì', 'ō', 'ó', 'ǒ', 'ò', 'ū', 'ú', 'ǔ', 'ù', 'ǖ', 'ǘ', 'ǚ', 'ǜ', 'ü', 'ê', 'ń', 'ň', 'ǹ']
    };
  }

  // 应用级控制配置
  if (appOptions?.value?.trim()) {
    const appList = appOptions.value.trim().split('\n')
      .map(line => line.trim())
      .filter(line => line && !line.startsWith('#'));

    if (appList.length > 0) {
      yamlObj.patch.app_options = {};
      appList.forEach(bundleId => {
        yamlObj.patch.app_options[bundleId] = { ascii_mode: true };
      });
    }
  }

  return yamlObj;
}

// 生成自定义短语文本（custom_phrase.txt 格式）
export function generateCustomPhrases() {
  const customPhrases = el('customPhrases');
  if (!customPhrases?.value?.trim()) {
    return '';
  }

  const lines = customPhrases.value.trim().split('\n')
    .map(line => line.trim())
    .filter(line => line && !line.startsWith('#'));

  if (lines.length === 0) {
    return '';
  }

  // custom_phrase.txt 格式：
  // # Rime table
  // # coding: utf-8
  // #@/db_name custom_phrase.txt
  // #@/db_type tabledb
  //
  // 文本内容<tab>编码

  let result = '# Rime table\n';
  result += '# coding: utf-8\n';
  result += '#@/db_name custom_phrase.txt\n';
  result += '#@/db_type tabledb\n';
  result += '\n';

  lines.forEach(line => {
    // 用户输入格式：编码<tab>文本
    // custom_phrase.txt 格式：文本<tab>编码
    const parts = line.split('\t');
    if (parts.length >= 2) {
      const code = parts[0].trim();
      const text = parts[1].trim();
      if (code && text) {
        result += `${text}\t${code}\n`;
      }
    }
  });

  return result;
}

// 生成皮肤配置 YAML
export function renderSquirrelYaml() {
  const colorScheme = el('colorScheme');
  const colorSchemeDark = el('colorSchemeDark');
  const fontFace = el('fontFace');
  const fontSize = el('fontSize');
  const cornerRadius = el('cornerRadius');
  const lineSpacing = el('lineSpacing');
  const spacing = el('spacing');
  const inlinePreedit = el('inlinePreedit');
  const candidateLayout = document.querySelector('input[name="candidateLayout"]:checked');

  const squirrelObj = {
    patch: {
      style: {
        color_scheme: colorScheme?.value || 'lost_temple',
        color_scheme_dark: colorSchemeDark?.value || 'nord',
        font_face: fontFace?.value || '',
        font_point: parseInt(fontSize?.value) || 18,
        corner_radius: parseInt(cornerRadius?.value) || 10,
        line_spacing: parseInt(lineSpacing?.value) || 6,
        spacing: parseInt(spacing?.value) || 8,
        inline_preedit: inlinePreedit?.checked || false
      }
    }
  };

  if (candidateLayout?.value === 'horizontal') {
    squirrelObj.patch.style.horizontal = true;
  }

  return squirrelObj;
}

// 生成 Emoji 词库
export function generateEmojiDict() {
  return `# Rime dictionary
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
`;
}

// 生成 Lua 脚本
export function generateRimeLua() {
  return `-- Rime Lua 脚本
-- 日期和农历翻译器

function date_translator(input, seg)
  if (input == "rq") then
    local date = os.date("*t")
    yield(Candidate("date", seg.start, seg._end, 
      string.format("%d年%d月%d日", date.year, date.month, date.day), 
      "阳历"))
    yield(Candidate("date", seg.start, seg._end, 
      string.format("%d-%02d-%02d", date.year, date.month, date.day), 
      "ISO"))
  end
end

function lunar_translator(input, seg)
  if (input == "nl") then
    yield(Candidate("lunar", seg.start, seg._end, "农历功能开发中", "提示"))
  end
end
`;
}
