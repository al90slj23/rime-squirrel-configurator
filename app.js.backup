document.addEventListener('DOMContentLoaded', () => {
  const el = (id)=>document.getElementById(id);
  const schemaId = el('schemaId');
  const outName = el('outName');
  const hotkey = el('hotkey');
  const hotkeySwitch = el('hotkeySwitch');
  const hotkeyAscii = el('hotkeyAscii');
  const hotkeyCapsLock = el('hotkeyCapsLock');
  const hotkeyFullShape = el('hotkeyFullShape');
  const asciiMode = el('asciiMode');
  const fullShape = el('fullShape');
  const asciiPunct = el('asciiPunct');
  const pageSize = el('pageSize');
  const customLabels = el('customLabels');
  const customLabelsWrap = el('customLabelsWrap');
  const asciiComposer = el('asciiComposer');
  const enableEmail = el('enableEmail');
  const enableUrl = el('enableUrl');
  const enableUppercase = el('enableUppercase');
  const enablePunctuator = el('enablePunctuator');
  const enableEmoji = el('enableEmoji');
  const enableLunar = el('enableLunar');
  const enableSymbols = el('enableSymbols');
  // 皮肤配置元素
  const colorScheme = el('colorScheme');
  const colorSchemeDark = el('colorSchemeDark');
  const fontFace = el('fontFace');
  const fontSize = el('fontSize');
  const cornerRadius = el('cornerRadius');
  const lineSpacing = el('lineSpacing');
  const spacing = el('spacing');
  const inlinePreedit = el('inlinePreedit');
  const preview = el('preview');
  const drop = el('drop');

  // 主题切换功能
  const themeToggle = el('themeToggle');
  const themeIcon = el('themeIcon');
  const html = document.documentElement;

  // 加载保存的主题或默认使用深色主题
  const savedTheme = localStorage.getItem('theme') || 'dark';
  if (savedTheme === 'light') {
    html.setAttribute('data-theme', 'light');
    themeIcon.textContent = '☀️';
  }

  // 主题切换按钮点击事件
  themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    html.setAttribute('data-theme', newTheme);
    themeIcon.textContent = newTheme === 'light' ? '☀️' : '🌙';
    localStorage.setItem('theme', newTheme);
  });

  // 切换自定义标签输入框显示
  document.querySelectorAll('input[name="selectLabels"]').forEach(radio=>{
    radio.addEventListener('change', ()=>{
      customLabelsWrap.style.display = radio.value === 'custom' ? 'flex' : 'none';
      updatePreview();
    });
  });

  // 快捷键风格预设
  const hotkeyPresets = {
    windows: {
      hotkeySwitch: 'Control+Shift',
      hotkeyAscii: 'Shift_L',
      hotkeyCapsLock: 'Caps_Lock',
      hotkeyFullShape: 'Control+space',
      hotkey: 'Control+Shift+F'
    },
    macos: {
      hotkeySwitch: 'Control+space',
      hotkeyAscii: 'Caps_Lock',
      hotkeyCapsLock: 'Shift_L',
      hotkeyFullShape: 'Shift+space',
      hotkey: 'Control+Shift+4'
    }
  };

  // 快捷键风格切换
  let isManualEdit = false; // 标记是否手动编辑过

  document.querySelectorAll('input[name="hotkeyStyle"]').forEach(radio => {
    radio.addEventListener('change', () => {
      const style = radio.value;

      if (style === 'windows' || style === 'macos') {
        isManualEdit = false;
        const preset = hotkeyPresets[style];

        // 应用预设值
        hotkeySwitch.value = preset.hotkeySwitch;
        hotkeyAscii.value = preset.hotkeyAscii;
        hotkeyCapsLock.value = preset.hotkeyCapsLock;
        hotkeyFullShape.value = preset.hotkeyFullShape;
        hotkey.value = preset.hotkey;
      }
      // 如果是自定义，不做任何改变，保持当前值
    });
  });

  // 检查快捷键是否匹配某个预设
  function checkHotkeyStyle() {
    if (isManualEdit) return; // 如果正在手动编辑，不检查

    const currentValues = {
      hotkeySwitch: hotkeySwitch.value.trim(),
      hotkeyAscii: hotkeyAscii.value.trim(),
      hotkeyCapsLock: hotkeyCapsLock.value.trim(),
      hotkeyFullShape: hotkeyFullShape.value.trim(),
      hotkey: hotkey.value.trim()
    };

    // 检查是否匹配 Windows 预设
    const matchWindows = Object.keys(hotkeyPresets.windows).every(
      key => currentValues[key] === hotkeyPresets.windows[key]
    );

    // 检查是否匹配 macOS 预设
    const matchMacos = Object.keys(hotkeyPresets.macos).every(
      key => currentValues[key] === hotkeyPresets.macos[key]
    );

    // 自动切换到匹配的风格
    if (matchWindows) {
      document.querySelector('input[name="hotkeyStyle"][value="windows"]').checked = true;
    } else if (matchMacos) {
      document.querySelector('input[name="hotkeyStyle"][value="macos"]').checked = true;
    } else {
      document.querySelector('input[name="hotkeyStyle"][value="custom"]').checked = true;
    }
  }

  // 为所有快捷键输入框添加 input 事件监听
  [hotkeySwitch, hotkeyAscii, hotkeyCapsLock, hotkeyFullShape, hotkey].forEach(input => {
    input.addEventListener('input', () => {
      isManualEdit = true;
      checkHotkeyStyle();
      setTimeout(() => { isManualEdit = false; }, 100);
    });
  });

  // 快捷键录制功能
  let isRecording = false;
  let currentRecordTarget = null;

  // 为所有录制按钮添加事件监听
  document.querySelectorAll('.record-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const targetInput = document.getElementById(targetId);

      if(isRecording && currentRecordTarget === targetInput){
        // 停止录制
        isRecording = false;
        currentRecordTarget = null;
        btn.textContent = '🎹 录制';
        btn.style.background = '';
        targetInput.removeAttribute('readonly');
        return;
      }

      // 停止之前的录制（如果有）
      if(isRecording && currentRecordTarget){
        const prevBtn = document.querySelector(`[data-target="${currentRecordTarget.id}"]`);
        if(prevBtn){
          prevBtn.textContent = '🎹 录制';
          prevBtn.style.background = '';
        }
        currentRecordTarget.removeAttribute('readonly');
      }

      // 开始录制
      isRecording = true;
      currentRecordTarget = targetInput;
      btn.textContent = '⏺ 录制中...';
      btn.style.background = '#dc3545';
      targetInput.value = '按下快捷键...';
      targetInput.focus();
    });
  });

  // 键盘事件处理函数
  function handleHotkeyRecord(e) {
    if(!isRecording || !currentRecordTarget) return;

    e.preventDefault();
    const keys = [];

    // 修饰键
    if(e.ctrlKey || e.metaKey) keys.push('Control');
    if(e.shiftKey) keys.push('Shift');
    if(e.altKey) keys.push('Alt');

    // 主键
    const mainKey = e.key;

    // 特殊处理：单独按修饰键的情况
    if(['Control','Shift','Alt','Meta'].includes(mainKey)){
      // 检查是否是左右修饰键
      if(e.location === KeyboardEvent.DOM_KEY_LOCATION_LEFT){
        if(mainKey === 'Shift') keys.push('Shift_L');
        else if(mainKey === 'Control') keys.push('Control_L');
        else if(mainKey === 'Alt') keys.push('Alt_L');
      } else if(e.location === KeyboardEvent.DOM_KEY_LOCATION_RIGHT){
        if(mainKey === 'Shift') keys.push('Shift_R');
        else if(mainKey === 'Control') keys.push('Control_R');
        else if(mainKey === 'Alt') keys.push('Alt_R');
      } else {
        // 如果无法区分左右，则使用通用名称
        if(keys.length === 0) keys.push(mainKey);
      }
    } else {
      // 特殊键名映射
      const keyMap = {
        ' ': 'space',
        'Enter': 'Return',
        'ArrowUp': 'Up',
        'ArrowDown': 'Down',
        'ArrowLeft': 'Left',
        'ArrowRight': 'Right',
        'Escape': 'Escape',
        'CapsLock': 'Caps_Lock',
        '`': 'grave',
        '-': 'minus',
        '=': 'equal',
        '[': 'bracketleft',
        ']': 'bracketright',
        '\\': 'backslash',
        ';': 'semicolon',
        "'": 'apostrophe',
        ',': 'comma',
        '.': 'period',
        '/': 'slash'
      };

      const mappedKey = keyMap[mainKey] || mainKey.toUpperCase();
      keys.push(mappedKey);
    }

    // 生成热键字符串
    const hotkeyStr = keys.join('+');
    currentRecordTarget.value = hotkeyStr;

    // 停止录制
    setTimeout(()=>{
      isRecording = false;
      const btn = document.querySelector(`[data-target="${currentRecordTarget.id}"]`);
      if(btn){
        btn.textContent = '🎹 录制';
        btn.style.background = '';
      }
      currentRecordTarget.removeAttribute('readonly');
      currentRecordTarget = null;

      // 录制完成后检查风格
      checkHotkeyStyle();
    }, 300);
  }

  // 为所有快捷键输入框添加键盘监听
  [hotkey, hotkeySwitch, hotkeyAscii, hotkeyCapsLock, hotkeyFullShape].forEach(input => {
    input.addEventListener('keydown', handleHotkeyRecord);
  });

  function getSimpDefault(){
    const v = document.querySelector('input[name="simp"]:checked').value;
    return v === 'simp' ? 1 : 0; // reset:1 简体；0 繁体
  }

  function getSelectLabels(){
    const labelType = document.querySelector('input[name="selectLabels"]:checked').value;
    if(labelType === 'custom' && customLabels.value.trim()){
      return customLabels.value.trim().split(/\s+/).filter(Boolean);
    }
    // 默认数字标签
    const size = parseInt(pageSize.value) || 9;
    return Array.from({length: size}, (_, i) => i + 1);
  }

  function renderYaml(){
    const hk = hotkey.value.split(',')
      .map(s=>s.trim()).filter(Boolean);

    const yamlObj = {
      patch: {
        schema: {
          name: getSimpDefault() === 1 ? '朙月拼音（簡體優先）' : '朙月拼音（繁體優先）',
          description: (getSimpDefault() === 1
            ? '預設輸出簡體，可用熱鍵在簡繁間切換。'
            : '預設輸出繁體，可用熱鍵在簡繁間切換。')
        },
        switches: [
          { name: 'ascii_mode', reset: asciiMode.checked ? 0 : 1, states: [' 中文',' 西文'] },
          { name: 'full_shape', reset: fullShape.checked ? 1 : 0, states: [' 半角',' 全角'] },
          { name: 'simplification', reset: getSimpDefault(), states: [' 简体',' 繁體'] },
          { name: 'ascii_punct', reset: asciiPunct.checked ? 0 : 1, states: [' 。，',' ．，'] }
        ].concat(
          enableEmoji.checked ? [{ name: 'emoji', reset: 1, states: ['🈚️','🈶️'] }] : [],
          enableLunar.checked ? [{ name: 'lunar', reset: 0, states: ['☀️','🌙'] }] : []
        ),
        switcher: {
          caption: '方案選單',
          hotkeys: (hotkeySwitch.value.trim() || 'Control+Shift').split(',').map(s=>s.trim()).filter(Boolean),
          abbreviate_options: true,
          option_list_separator: '／'
        },
        key_binder: {
          import_preset: 'default',
          bindings: [
            // 简繁切换
            { when: 'composing', accept: (hk[0]||'Control+Shift+F'), toggle: 'simplification' },
            // 中英文切换
            { when: 'always', accept: (hotkeyAscii.value.trim() || 'Shift_L'), toggle: 'ascii_mode' },
            // 全角半角切换
            { when: 'always', accept: (hotkeyFullShape.value.trim() || 'Control+space'), toggle: 'full_shape' }
          ]
        },
        menu: {
          alternative_select_labels: getSelectLabels(),
          page_size: parseInt(pageSize.value) || 9
        }
      }
    };

    // Punctuator 标点符号设置
    if(enablePunctuator.checked){
      yamlObj.patch.punctuator = { import_preset: 'default' };
    }

    // ASCII composer 设置（Caps Lock 行为）
    if(asciiComposer.checked){
      yamlObj.patch.ascii_composer = {
        good_old_caps_lock: true,
        switch_key: {
          Caps_Lock: hotkeyCapsLock.value.trim() || 'Caps_Lock'
        }
      };
    }

    // Recognizer patterns
    const patterns = {};
    if(enableEmail.checked){
      patterns.email = "^[A-Za-z][-_.0-9A-Za-z]*@.*$";
    }
    if(enableUrl.checked){
      patterns.url = "^(www[.]|https?:|ftp[.:]|mailto:|file:).*$|^[a-z]+[.].+$";
    }
    if(enableUppercase.checked){
      patterns.uppercase = "[A-Z][-_+.'0-9A-Za-z]*$";
    }
    if(Object.keys(patterns).length > 0){
      yamlObj.patch.recognizer = { patterns };
    }

    // Emoji 和农历支持的引擎配置
    if(enableEmoji.checked || enableLunar.checked){
      const translators = [
        'punct_translator',
        'script_translator'
      ];

      if(enableEmoji.checked){
        translators.push('table_translator@emoji');
      }
      if(enableLunar.checked){
        translators.push('lua_translator@date_translator');
        translators.push('lua_translator@lunar_translator');
      }

      yamlObj.patch['engine/translators'] = translators;
    }

    // Emoji 配置
    if(enableEmoji.checked){
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
    if(enableLunar.checked){
      if(!yamlObj.patch.recognizer){
        yamlObj.patch.recognizer = { patterns: {} };
      }
      if(!yamlObj.patch.recognizer.patterns){
        yamlObj.patch.recognizer.patterns = {};
      }
      yamlObj.patch.recognizer.patterns.date = "^rq$";
      yamlObj.patch.recognizer.patterns.lunar = "^nl$";
    }

    // 符号输入配置
    if(enableSymbols.checked){
      yamlObj.patch['punctuator/symbols'] = {
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
        '/sx': ['⇑', '⇓', '⇐', '⇒', '⇖', '⇗', '⇙', '⇘', '⇔', '⇕'],
        '/dh': ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⑩'],
        '/xh': ['⑴', '⑵', '⑶', '⑷', '⑸', '⑹', '⑺', '⑻', '⑼', '⑽'],
        '/xm': ['Ⅰ', 'Ⅱ', 'Ⅲ', 'Ⅳ', 'Ⅴ', 'Ⅵ', 'Ⅶ', 'Ⅷ', 'Ⅸ', 'Ⅹ', 'Ⅺ', 'Ⅻ'],
        '/xxm': ['ⅰ', 'ⅱ', 'ⅲ', 'ⅳ', 'ⅴ', 'ⅵ', 'ⅶ', 'ⅷ', 'ⅸ', 'ⅹ'],
        '/dw': ['°', '℃', '℉', '‰', '‱', '㎡', '㎥', '㎞', '㎏', '㎜'],
        '/bz': ['$', '¥', '€', '£', '¢', '₩'],
        '/xh2': ['※', '★', '☆', '○', '●', '◎', '◇', '◆', '□', '■', '△', '▲', '▽', '▼'],
        '/fh': ['♠', '♣', '♥', '♦'],
        '/ts': ['♩', '♪', '♫', '♬', '♭', '♮', '♯'],
        '/sx2': ['Α', 'Β', 'Γ', 'Δ', 'Ε', 'Ζ', 'Η', 'Θ', 'Ι', 'Κ', 'Λ', 'Μ', 'Ν', 'Ξ', 'Ο', 'Π', 'Ρ', 'Σ', 'Τ', 'Υ', 'Φ', 'Χ', 'Ψ', 'Ω'],
        '/xx': ['α', 'β', 'γ', 'δ', 'ε', 'ζ', 'η', 'θ', 'ι', 'κ', 'λ', 'μ', 'ν', 'ξ', 'ο', 'π', 'ρ', 'σ', 'τ', 'υ', 'φ', 'χ', 'ψ', 'ω'],
        '/py': ['ā', 'á', 'ǎ', 'à', 'ē', 'é', 'ě', 'è', 'ī', 'í', 'ǐ', 'ì', 'ō', 'ó', 'ǒ', 'ò', 'ū', 'ú', 'ǔ', 'ù', 'ǖ', 'ǘ', 'ǚ', 'ǜ', 'ü', 'ê', 'ń', 'ň', 'ǹ']
      };
    }

    return yamlObj;
  }

  function renderSquirrelYaml(){
    const candidateLayout = document.querySelector('input[name="candidateLayout"]:checked').value;

    const squirrelObj = {
      patch: {
        show_notifications_when: 'appropriate',
        style: {
          color_scheme: colorScheme.value,
          color_scheme_dark: colorSchemeDark.value,
          candidate_list_layout: candidateLayout,
          text_orientation: 'horizontal',
          inline_preedit: inlinePreedit.checked,
          corner_radius: parseInt(cornerRadius.value) || 5,
          line_spacing: parseInt(lineSpacing.value) || 5,
          spacing: parseInt(spacing.value) || 8,
          font_face: fontFace.value || 'PingFangSC',
          font_point: parseInt(fontSize.value) || 16
        }
      }
    };

    return squirrelObj;
  }

  function generateEmojiDict(){
    return `---
name: emoji
version: "1.0"
sort: by_weight
use_preset_vocabulary: false
...

# 常用 Emoji 词库

# 表情
😀	xiaolian	1
😁	luochilexiao	1
😂	xikulian	1
🤣	gundilexiao	1
😃	zhangzuilexiao	1
😄	meixiaolexiao	1
😅	dahan	1
😆	mizhuilexiao	1
😊	weixiao	1
😉	zhayan	1
😍	aixin	1
😘	qinqin	1
😋	chankou	1
😎	taiyanjing	1
🤔	sikao	1
😐	wubiaojing	1
😑	wuyu	1
😶	wuhua	1
🙄	fanbaiyuan	1
😏	huaixiao	1
😣	jianjue	1
😥	shiwang	1
😮	jingya	1
😯	chijing	1
😪	kunle	1
😫	pituan	1
😴	shuijiao	1
😌	manzu	1

# 手势
👍	zan	1
👎	cai	1
👌	ok	1
✌️	shou	1
🤞	jiaocha	1
🤟	aini	1
🤘	yaogun	1
👏	guzhang	1
🙌	jubei	1
👐	zhangkai	1
🤝	woshou	1
🙏	qidao	1
✊	quantou	1
👊	chuiquan	1
🤛	zuoquan	1
🤜	youquan	1

# 心形
❤️	aixin	2
💔	xinpo	1
💕	aixin	1
💖	aixin	1
💗	aixin	1
💘	aixin	1
💙	lanxin	1
💚	lvxin	1
💛	huangxin	1
🧡	chengxin	1
💜	zixin	1
🖤	heixin	1
🤍	baixxin	1

# 动物
🐶	gou	1
🐱	mao	1
🐭	laoshu	1
🐹	cangxhu	1
🐰	tuzi	1
🦊	huhu	1
🐻	xiong	1
🐼	xiongmao	1
🐨	kaola	1
🐯	laohu	1
🦁	shizi	1
🐮	niu	1
🐷	zhu	1
🐸	qingwa	1
🐵	houzi	1
🐔	ji	1
🐧	qie	1
🐦	niao	1
🦆	ya	1
🐺	lang	1
🐗	yezhu	1
🐴	ma	1
🦄	dujiaoshou	1
🐝	mifeng	1
🐛	chongzi	1
🦋	hudie	1
🐌	wonziu	1
🐞	piaochong	1
🐢	wugui	1
🐍	she	1
🐙	zhangyu	1
🦀	xie	1
🐠	yu	1
🐟	yu	1
🐬	haitun	1
🐳	jingyu	1
🦈	shayu	1

# 食物
🍎	pingguo	1
🍊	juzi	1
🍋	ningmeng	1
🍌	xiangjiao	1
🍉	xigua	1
🍇	putao	1
🍓	caomei	1
🍒	yingtao	1
🍑	taozi	1
🍍	boluo	1
🥭	mangguo	1
🥝	mihoutao	1
🍅	xihongshi	1
🥑	niuyouguo	1
🥦	xilan	1
🥒	huanggua	1
🌶️	lajiao	1
🌽	yumi	1
🥕	huluobu	1
🥔	tudou	1
🍞	mianbao	1
🥐	niujiao	1
🧀	nailao	1
🥚	jidan	1
🍳	jidan	1
🥓	bacon	1
🥩	rou	1
🍗	jitui	1
🍖	rou	1
🌭	regou	1
🍔	hanbao	1
🍟	shutiao	1
🍕	pisa	1
🥪	sanmingzhi	1
🌮	taco	1
🥗	shala	1
🍝	yidali	1
🍜	mian	1
🍲	guo	1
🍛	gali	1
🍣	shousi	1
🍱	biandang	1
🥟	jiaozi	1
🍤	xia	1
🍙	fantuan	1
🍚	mifan	1
🥮	yuebing	1
🍦	bingqilin	1
🍧	bingsha	1
🍨	bingqilin	1
🍩	tianquan	1
🍪	binggan	1
🎂	dangao	1
🍰	dangao	1
🍫	qiaokeli	1
🍬	tang	1
🍭	tangguo	1
🍯	fengmi	1
🍼	naiping	1
☕	kafei	1
🍵	cha	1
🥤	yinliao	1
🍶	jiu	1
🍺	pijiu	1
🍻	pijiu	1
🥂	xiangbin	1
🍷	hongjiu	1
🥃	weishiji	1
🍸	jiweiiju	1
🍹	yinliao	1
🍾	xiangbin	1

# 交通
🚗	qiche	1
🚕	chuzuche	1
🚙	suv	1
🚌	gongjiao	1
🚎	dianche	1
🚐	mianbao	1
🚑	jiuhuche	1
🚒	xiaofangche	1
🚓	jingche	1
🚚	huoche	1
🚛	tuoche	1
🏎️	saiche	1
🚜	tuolaji	1
🛵	motuoche	1
🚲	zixingche	1
✈️	feiji	1
🚀	huojian	1
🚁	zhishengji	1
🚂	huoche	1
🚃	dieche	1
🚄	gaotie	1
🚅	gaotie	1
🚆	huoche	1
🚇	ditie	1
🚈	ditie	1
🚉	che	1
🚊	dianche	1
🚝	ditie	1
🚞	shan	1
🚋	dianche	1
🚌	bus	1
🚍	bus	1
🚎	dianche	1
🚐	xiaoche	1
⛵	chuang	1
🚤	kuaiting	1
⛴️	lunchuan	1
🛳️	youlun	1
🚢	chuan	1

# 符号
⭐	xing	1
🌟	xing	1
✨	shanshuo	1
⚡	shandian	1
🔥	huo	1
💧	shui	1
🌊	lang	1
🎉	qingzhu	1
🎊	caidai	1
🎈	qiqiu	1
🎁	liwu	1
🎀	hudiejie	1
🎵	yinyue	1
🎶	yinyue	1
🎤	maike	1
🎧	erji	1
📱	shouji	1
💻	diannao	1
⌨️	jianpan	1
🖱️	shubiao	1
🖨️	dayinji	1
📷	xiangji	1
📹	shexiangji	1
📺	dianshi	1
📻	shouyinji	1
⏰	naozhong	1
⏱️	jishiqi	1
⏲️	shijian	1
🕰️	zhong	1
📖	shu	1
📚	shu	1
📝	biji	1
📄	wenjian	1
📃	wenjian	1
📋	jiandian	1
📌	dingzhen	1
📍	weizhi	1
✅	duihao	1
❌	cha	1
❎	cha	1
✔️	dui	1
☑️	xuanzhong	1
⚠️	jinggao	1
🚫	jinzhi	1
⛔	jinzhi	1
🔞	shiba	1
📵	shoujijin	1
🚭	jingyan	1
♻️	huishou	1
`;
  }

  function generateRimeLua(){
    return `-- Rime Lua 扩展脚本
-- 日期时间和农历功能

-- 日期转换器
function date_translator(input, seg)
    if input == "rq" then
        local year = os.date("%Y")
        local month = os.date("%m")
        local day = os.date("%d")
        local time = os.date("%H:%M:%S")
        local week_map = {"日", "一", "二", "三", "四", "五", "六"}
        local week = "星期" .. week_map[tonumber(os.date("%w")) + 1]

        -- 中文日期格式
        yield(Candidate("date", seg.start, seg._end,
            year .. "年" .. month .. "月" .. day .. "日",
            "〔日期〕"))

        -- 中文日期 + 星期
        yield(Candidate("date", seg.start, seg._end,
            year .. "年" .. month .. "月" .. day .. "日 " .. week,
            "〔日期+星期〕"))

        -- 中文日期 + 时间
        yield(Candidate("date", seg.start, seg._end,
            year .. "年" .. month .. "月" .. day .. "日 " .. time,
            "〔日期+时间〕"))

        -- ISO 日期格式
        yield(Candidate("date", seg.start, seg._end,
            os.date("%Y-%m-%d"),
            "〔ISO日期〕"))

        -- 斜杠日期格式
        yield(Candidate("date", seg.start, seg._end,
            os.date("%Y/%m/%d"),
            "〔斜杠日期〕"))

        -- 时间戳
        yield(Candidate("date", seg.start, seg._end,
            tostring(os.time()),
            "〔时间戳〕"))
    end
end

-- 农历转换器（简化版）
function lunar_translator(input, seg)
    if input == "nl" then
        -- 天干地支年份
        local tian_gan = {"甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"}
        local di_zhi = {"子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"}
        local sheng_xiao = {"鼠", "牛", "虎", "兔", "龙", "蛇", "马", "羊", "猴", "鸡", "狗", "猪"}

        local year = tonumber(os.date("%Y"))
        local tian_index = ((year - 4) % 10) + 1
        local di_index = ((year - 4) % 12) + 1

        local gan_zhi = tian_gan[tian_index] .. di_zhi[di_index]
        local xiao = sheng_xiao[di_index]

        yield(Candidate("lunar", seg.start, seg._end,
            gan_zhi .. "年 (" .. xiao .. "年)",
            "〔农历年份〕"))

        yield(Candidate("lunar", seg.start, seg._end,
            year .. " " .. xiao .. "年",
            "〔生肖〕"))

        -- 节气提示
        local month = tonumber(os.date("%m"))
        local jie_qi_map = {
            "立春/雨水", "惊蛰/春分", "清明/谷雨",
            "立夏/小满", "芒种/夏至", "小暑/大暑",
            "立秋/处暑", "白露/秋分", "寒露/霜降",
            "立冬/小雪", "大雪/冬至", "小寒/大寒"
        }
        yield(Candidate("lunar", seg.start, seg._end,
            "本月节气：" .. jie_qi_map[month],
            "〔节气〕"))
    end
end
`;
  }

  function updatePreview(){
    const previewType = document.querySelector('input[name="previewType"]:checked').value;
    if(previewType === 'schema'){
      const yamlObj = renderYaml();
      preview.value = jsyaml.dump(yamlObj, {lineWidth: 120});
      outName.textContent = `${schemaId.value || 'luna_pinyin'}.custom.yaml`;
    } else {
      const squirrelObj = renderSquirrelYaml();
      preview.value = jsyaml.dump(squirrelObj, {lineWidth: 120});
      outName.textContent = 'squirrel.custom.yaml';
    }
  }

  function download(text, filename){
    const blob = new Blob([text], {type: 'text/yaml;charset=utf-8'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function parseYamlAndFill(yamlText){
    try{
      const data = jsyaml.load(yamlText);
      const p = data && data.patch ? data.patch : data;
      if(!p){ return; }

      // 尝试从现有值回填
      const sw = (p.switches||[]).reduce((m,x)=>{ m[x.name]=x; return m; },{});
      if(sw.simplification){ // reset:1 简体；0 繁体
        const simp = sw.simplification.reset === 1 ? 'simp' : 'trad';
        document.querySelector(`input[name="simp"][value="${simp}"]`).checked = true;
      }
      if(sw.ascii_mode){ asciiMode.checked = (sw.ascii_mode.reset===0); }
      if(sw.full_shape){ fullShape.checked = (sw.full_shape.reset===1); }
      if(sw.ascii_punct){ asciiPunct.checked = (sw.ascii_punct.reset===0); }

      if(p.switcher && Array.isArray(p.switcher.hotkeys) && p.switcher.hotkeys.length){
        hotkey.value = p.switcher.hotkeys.join(', ');
      }

      // 回填 menu 设置
      if(p.menu){
        if(p.menu.page_size){ pageSize.value = p.menu.page_size; }
        if(Array.isArray(p.menu.alternative_select_labels)){
          const labels = p.menu.alternative_select_labels;
          // 检查是否为数字标签
          const isNumber = labels.every(l => typeof l === 'number');
          if(isNumber){
            document.querySelector('input[name="selectLabels"][value="number"]').checked = true;
          } else {
            document.querySelector('input[name="selectLabels"][value="custom"]').checked = true;
            customLabels.value = labels.join(' ');
            customLabelsWrap.style.display = 'flex';
          }
        }
      }

      // 回填 ascii_composer 设置
      if(p.ascii_composer && p.ascii_composer.good_old_caps_lock !== undefined){
        asciiComposer.checked = p.ascii_composer.good_old_caps_lock;
      }

      // 回填 recognizer 设置
      if(p.recognizer && p.recognizer.patterns){
        enableEmail.checked = !!p.recognizer.patterns.email;
        enableUrl.checked = !!p.recognizer.patterns.url;
        enableUppercase.checked = !!p.recognizer.patterns.uppercase;
      }

      updatePreview();
    }catch(e){
      alert('解析 YAML 失败：' + e.message);
    }
  }

  // 预览类型切换
  document.querySelectorAll('input[name="previewType"]').forEach(radio=>{
    radio.addEventListener('change', updatePreview);
  });

  // 初始化
  ['change','input'].forEach(evt=>{
    document.addEventListener(evt, (e)=>{
      updatePreview();
    });
  });
  updatePreview();

  // 拖拽读取现有 custom.yaml
  ;['dragenter','dragover'].forEach(ev=>{
    drop.addEventListener(ev, e=>{ e.preventDefault(); drop.classList.add('drag'); });
  });
  ;['dragleave','drop'].forEach(ev=>{
    drop.addEventListener(ev, e=>{ e.preventDefault(); drop.classList.remove('drag'); });
  });
  drop.addEventListener('drop', async (e)=>{
    const file = e.dataTransfer.files[0];
    if(!file) return;
    const text = await file.text();
    parseYamlAndFill(text);
    // 若文件名像 xxx.custom.yaml，尝试填充 schemaId
    const m = file.name.match(/^(.+)\.custom\.yaml$/i);
    if(m){ schemaId.value = m[1]; }
    updatePreview();
  });

  // 下载压缩配置包
  document.getElementById('btnDownloadZip').addEventListener('click', async ()=>{
    try {
      const zip = new JSZip();
      const schemaName = schemaId.value || 'luna_pinyin';

      // 1. 添加方案配置文件
      const yamlObj = renderYaml();
      const yamlText = jsyaml.dump(yamlObj, {lineWidth: 120});
      zip.file(`${schemaName}.custom.yaml`, yamlText);

      // 2. 添加皮肤配置文件
      const squirrelObj = renderSquirrelYaml();
      const squirrelText = jsyaml.dump(squirrelObj, {lineWidth: 120});
      zip.file('squirrel.custom.yaml', squirrelText);

      // 3. 如果启用了 Emoji，添加 emoji 词库
      if(enableEmoji.checked){
        const emojiDict = generateEmojiDict();
        zip.file('emoji.dict.yaml', emojiDict);
      }

      // 4. 如果启用了农历或 Emoji，添加 rime.lua
      if(enableLunar.checked || enableEmoji.checked){
        const rimeLua = generateRimeLua();
        zip.file('rime.lua', rimeLua);
      }

      // 5. 生成并下载 zip 文件
      const blob = await zip.generateAsync({type: 'blob'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `rime-config-${schemaName}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch(error) {
      console.error('下载压缩包失败:', error);
      alert('下载失败，请检查浏览器控制台');
    }
  });

  // 下载完整配置（分别下载多个文件）
  document.getElementById('btnDownloadFiles').addEventListener('click', ()=>{
    const yamlObj = renderYaml();
    const yamlText = jsyaml.dump(yamlObj, {lineWidth: 120});
    const name = `${schemaId.value || 'luna_pinyin'}.custom.yaml`;
    download(yamlText, name);

    // 下载皮肤配置
    const squirrelObj = renderSquirrelYaml();
    const squirrelText = jsyaml.dump(squirrelObj, {lineWidth: 120});
    download(squirrelText, 'squirrel.custom.yaml');

    // 如果启用了 Emoji，下载 emoji 词库
    if(enableEmoji.checked){
      const emojiDict = generateEmojiDict();
      download(emojiDict, 'emoji.dict.yaml');
    }

    // 如果启用了农历或 Emoji，下载 rime.lua
    if(enableLunar.checked || enableEmoji.checked){
      const rimeLua = generateRimeLua();
      download(rimeLua, 'rime.lua');
    }
  });

  // 复制部署命令
  document.getElementById('copyCmd').addEventListener('click', async ()=>{
    const cmd = document.getElementById('deployCmd').textContent;
    if(cmd === '点击上方按钮生成命令' || cmd === '命令将在配置后自动生成...'){
      alert('请稍候，命令正在生成中...');
      return;
    }
    try{
      await navigator.clipboard.writeText(cmd);
      const btn = document.getElementById('copyCmd');
      const originalText = btn.textContent;
      btn.textContent = '✓ 已复制';
      btn.style.background = '#28a745';
      setTimeout(()=>{
        btn.textContent = originalText;
        btn.style.background = '';
      }, 2000);
    }catch(e){
      // 降级方案：选中文本
      const range = document.createRange();
      range.selectNode(document.getElementById('deployCmd'));
      window.getSelection().removeAllRanges();
      window.getSelection().addRange(range);
    }
  });

  // 点击命令也可以选中
  document.getElementById('deployCmd').addEventListener('click', function(){
    const range = document.createRange();
    range.selectNode(this);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
  });

  // ==================== 交互式命令生成器 ====================

  // 动态更新部署命令
  function updateDeployCommand() {
    console.log('[命令生成] 开始生成部署命令');

    const cmdSchemaId = document.getElementById('cmdSchemaId');
    const cmdHotkeyStyle = document.getElementById('cmdHotkeyStyle');
    const cmdColorScheme = document.getElementById('cmdColorScheme');
    const cmdEmoji = document.getElementById('cmdEmoji');
    const cmdLunar = document.getElementById('cmdLunar');
    const cmdSymbols = document.getElementById('cmdSymbols');

    const schemaName = cmdSchemaId.value.trim() || 'luna_pinyin';
    const hotkeyStyle = cmdHotkeyStyle.value;
    const colorScheme = cmdColorScheme.value;
    const useEmoji = cmdEmoji.checked;
    const useLunar = cmdLunar.checked;
    const useSymbols = cmdSymbols.checked;

    // 构建命令参数
    const params = [];

    // 方案 ID（如果不是默认值）
    if (schemaName !== 'luna_pinyin') {
      params.push(`--schema ${schemaName}`);
    }

    // 快捷键风格
    params.push(`--hotkey ${hotkeyStyle}`);

    // 主题
    params.push(`--theme ${colorScheme}`);

    // 功能开关
    if (useEmoji) params.push('--emoji');
    if (useLunar) params.push('--lunar');
    if (useSymbols) params.push('--symbols');

    // 生成最终命令
    const deployCmd = `curl -fsSL https://raw.githubusercontent.com/al90slj23/rime-squirrel-configurator/main/install.sh | bash -s -- ${params.join(' ')}`;

    console.log('[命令生成] 参数:', params);
    console.log('[命令生成] 最终命令:', deployCmd);

    // 更新显示
    const cmdElement = document.getElementById('deployCmd');
    if (cmdElement) {
      cmdElement.textContent = deployCmd;
      console.log('[命令生成] 命令已更新到页面');
    } else {
      console.error('[命令生成] 错误：找不到 deployCmd 元素！');
    }
  }

  // 添加事件监听器
  document.getElementById('cmdSchemaId').addEventListener('input', updateDeployCommand);
  document.getElementById('cmdHotkeyStyle').addEventListener('change', updateDeployCommand);
  document.getElementById('cmdColorScheme').addEventListener('change', updateDeployCommand);
  document.getElementById('cmdEmoji').addEventListener('change', updateDeployCommand);
  document.getElementById('cmdLunar').addEventListener('change', updateDeployCommand);
  document.getElementById('cmdSymbols').addEventListener('change', updateDeployCommand);

  // 初始化命令
  updateDeployCommand();

}); // End of DOMContentLoaded
