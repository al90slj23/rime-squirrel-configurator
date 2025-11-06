// 快捷键管理模块

// 快捷键预设
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

let isManualEdit = false;
let isRecording = false;
let currentRecordTarget = null;

// 检查快捷键是否匹配某个预设
function checkHotkeyStyle() {
  if (isManualEdit) return;

  const hotkeySwitch = document.getElementById('hotkeySwitch');
  const hotkeyAscii = document.getElementById('hotkeyAscii');
  const hotkeyCapsLock = document.getElementById('hotkeyCapsLock');
  const hotkeyFullShape = document.getElementById('hotkeyFullShape');
  const hotkey = document.getElementById('hotkey');

  const currentValues = {
    hotkeySwitch: hotkeySwitch.value.trim(),
    hotkeyAscii: hotkeyAscii.value.trim(),
    hotkeyCapsLock: hotkeyCapsLock.value.trim(),
    hotkeyFullShape: hotkeyFullShape.value.trim(),
    hotkey: hotkey.value.trim()
  };

  const matchWindows = Object.keys(hotkeyPresets.windows).every(
    key => currentValues[key] === hotkeyPresets.windows[key]
  );

  const matchMacos = Object.keys(hotkeyPresets.macos).every(
    key => currentValues[key] === hotkeyPresets.macos[key]
  );

  if (matchWindows) {
    document.querySelector('input[name="hotkeyStyle"][value="windows"]').checked = true;
  } else if (matchMacos) {
    document.querySelector('input[name="hotkeyStyle"][value="macos"]').checked = true;
  } else {
    document.querySelector('input[name="hotkeyStyle"][value="custom"]').checked = true;
  }
}

// 键盘事件处理函数
function handleHotkeyRecord(e) {
  if(!isRecording || !currentRecordTarget) return;

  e.preventDefault();
  const keys = [];

  if(e.ctrlKey || e.metaKey) keys.push('Control');
  if(e.shiftKey) keys.push('Shift');
  if(e.altKey) keys.push('Alt');

  const mainKey = e.key;

  if(['Control','Shift','Alt','Meta'].includes(mainKey)){
    if(e.location === KeyboardEvent.DOM_KEY_LOCATION_LEFT){
      if(mainKey === 'Shift') keys.push('Shift_L');
      else if(mainKey === 'Control') keys.push('Control_L');
      else if(mainKey === 'Alt') keys.push('Alt_L');
    } else if(e.location === KeyboardEvent.DOM_KEY_LOCATION_RIGHT){
      if(mainKey === 'Shift') keys.push('Shift_R');
      else if(mainKey === 'Control') keys.push('Control_R');
      else if(mainKey === 'Alt') keys.push('Alt_R');
    } else {
      if(keys.length === 0) keys.push(mainKey);
    }
  } else {
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

  const hotkeyStr = keys.join('+');
  currentRecordTarget.value = hotkeyStr;

  setTimeout(()=>{
    isRecording = false;
    const btn = document.querySelector(`[data-target="${currentRecordTarget.id}"]`);
    if(btn){
      btn.textContent = '🎹 录制';
      btn.style.background = '';
    }
    currentRecordTarget.removeAttribute('readonly');
    currentRecordTarget = null;
    checkHotkeyStyle();
  }, 300);
}

// 初始化快捷键管理
export function initHotkeys() {
  const hotkeySwitch = document.getElementById('hotkeySwitch');
  const hotkeyAscii = document.getElementById('hotkeyAscii');
  const hotkeyCapsLock = document.getElementById('hotkeyCapsLock');
  const hotkeyFullShape = document.getElementById('hotkeyFullShape');
  const hotkey = document.getElementById('hotkey');

  // 快捷键风格切换
  document.querySelectorAll('input[name="hotkeyStyle"]').forEach(radio => {
    radio.addEventListener('change', () => {
      const style = radio.value;

      if (style === 'windows' || style === 'macos') {
        isManualEdit = false;
        const preset = hotkeyPresets[style];

        hotkeySwitch.value = preset.hotkeySwitch;
        hotkeyAscii.value = preset.hotkeyAscii;
        hotkeyCapsLock.value = preset.hotkeyCapsLock;
        hotkeyFullShape.value = preset.hotkeyFullShape;
        hotkey.value = preset.hotkey;
      }
    });
  });

  // 为所有快捷键输入框添加 input 事件监听
  [hotkeySwitch, hotkeyAscii, hotkeyCapsLock, hotkeyFullShape, hotkey].forEach(input => {
    input.addEventListener('input', () => {
      isManualEdit = true;
      checkHotkeyStyle();
      setTimeout(() => { isManualEdit = false; }, 100);
    });
  });

  // 录制按钮事件
  document.querySelectorAll('.record-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const targetInput = document.getElementById(targetId);

      if(isRecording && currentRecordTarget === targetInput){
        isRecording = false;
        currentRecordTarget = null;
        btn.textContent = '🎹 录制';
        btn.style.background = '';
        targetInput.removeAttribute('readonly');
        return;
      }

      if(isRecording && currentRecordTarget){
        const prevBtn = document.querySelector(`[data-target="${currentRecordTarget.id}"]`);
        if(prevBtn){
          prevBtn.textContent = '🎹 录制';
          prevBtn.style.background = '';
        }
        currentRecordTarget.removeAttribute('readonly');
      }

      isRecording = true;
      currentRecordTarget = targetInput;
      btn.textContent = '⏺ 录制中...';
      btn.style.background = '#dc3545';
      targetInput.value = '按下快捷键...';
      targetInput.focus();
    });
  });

  // 键盘事件监听
  [hotkey, hotkeySwitch, hotkeyAscii, hotkeyCapsLock, hotkeyFullShape].forEach(input => {
    input.addEventListener('keydown', handleHotkeyRecord);
  });
}

export { hotkeyPresets };
