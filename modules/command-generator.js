// 完整配置命令生成器模块
import { el, getSimpDefault, getSelectLabels } from './utils.js';

// 读取所有主界面配置
export function getAllConfig() {
  return {
    // 基础信息
    schema: el('schemaId')?.value?.trim() || 'luna_pinyin',

    // 简繁设置
    simpDefault: getSimpDefault(),

    // 默认模式
    asciiMode: el('asciiMode')?.checked || false,
    fullShape: el('fullShape')?.checked || false,
    asciiPunct: el('asciiPunct')?.checked || false,

    // 快捷键
    hotkey: el('hotkey')?.value?.trim() || 'Control+Shift+F',
    hotkeySwitch: el('hotkeySwitch')?.value?.trim() || 'Control+Shift',
    hotkeyAscii: el('hotkeyAscii')?.value?.trim() || 'Shift_L',
    hotkeyCapsLock: el('hotkeyCapsLock')?.value?.trim() || 'Caps_Lock',
    hotkeyFullShape: el('hotkeyFullShape')?.value?.trim() || 'Control+space',

    // 候选词
    pageSize: parseInt(el('pageSize')?.value) || 6,
    selectLabels: getSelectLabels(),

    // ASCII Composer
    asciiComposer: el('asciiComposer')?.checked !== false,

    // 识别器
    enableEmail: el('enableEmail')?.checked !== false,
    enableUrl: el('enableUrl')?.checked !== false,
    enableUppercase: el('enableUppercase')?.checked !== false,

    // 其他功能
    enablePunctuator: el('enablePunctuator')?.checked !== false,
    enableEmoji: el('enableEmoji')?.checked !== false,
    enableLunar: el('enableLunar')?.checked !== false,
    enableSymbols: el('enableSymbols')?.checked !== false,

    // 皮肤
    colorScheme: el('colorScheme')?.value || 'lost_temple',
    colorSchemeDark: el('colorSchemeDark')?.value || 'nord',
    fontFace: el('fontFace')?.value || '',
    fontSize: parseInt(el('fontSize')?.value) || 18,
    cornerRadius: parseInt(el('cornerRadius')?.value) || 10,
    lineSpacing: parseInt(el('lineSpacing')?.value) || 6,
    spacing: parseInt(el('spacing')?.value) || 8,
    inlinePreedit: el('inlinePreedit')?.checked || false,
    candidateLayout: document.querySelector('input[name="candidateLayout"]:checked')?.value || 'vertical'
  };
}

// 生成部署命令
export function generateDeployCommand(config = null) {
  const cfg = config || getAllConfig();

  // 将配置转为 JSON 并 base64 编码
  const configJson = JSON.stringify(cfg);
  const configB64 = btoa(encodeURIComponent(configJson).replace(/%([0-9A-F]{2})/g,
    (_, p1) => String.fromCharCode('0x' + p1)));

  // 生成命令
  const cmd = `curl -fsSL https://raw.githubusercontent.com/al90slj23/rime-squirrel-configurator/main/install.sh | bash -s -- --config "${configB64}"`;

  return cmd;
}

// 初始化交互式命令生成器
export function initCommandGenerator() {
  const deployCmd = el('deployCmd');
  const copyCmd = el('copyCmd');

  if (!deployCmd) {
    console.warn('[命令生成器] 未找到 deployCmd 元素');
    return;
  }

  // 更新命令
  function updateCommand() {
    try {
      const cmd = generateDeployCommand();
      deployCmd.textContent = cmd;
      console.log('[命令生成器] 命令已更新');
    } catch(error) {
      console.error('[命令生成器] 生成命令失败:', error);
      deployCmd.textContent = '生成命令失败，请检查配置';
    }
  }

  // 监听所有主界面配置变化
  const watchElements = [
    'schemaId', 'hotkey', 'hotkeySwitch', 'hotkeyAscii', 'hotkeyCapsLock', 'hotkeyFullShape',
    'pageSize', 'customLabels', 'colorScheme', 'colorSchemeDark', 'fontFace',
    'fontSize', 'cornerRadius', 'lineSpacing', 'spacing',
    'asciiMode', 'fullShape', 'asciiPunct', 'asciiComposer',
    'enableEmail', 'enableUrl', 'enableUppercase', 'enablePunctuator',
    'enableEmoji', 'enableLunar', 'enableSymbols', 'inlinePreedit'
  ];

  watchElements.forEach(id => {
    const elem = el(id);
    if (elem) {
      const eventType = elem.type === 'checkbox' ? 'change' : 'input';
      elem.addEventListener(eventType, updateCommand);
    }
  });

  // 监听单选按钮
  document.querySelectorAll('input[name="simp"], input[name="selectLabels"], input[name="hotkeyStyle"], input[name="candidateLayout"]').forEach(radio => {
    radio.addEventListener('change', updateCommand);
  });

  // 复制命令
  if (copyCmd) {
    copyCmd.addEventListener('click', async () => {
      const cmd = deployCmd.textContent;
      if (!cmd || cmd === '命令将在配置后自动生成...') {
        alert('命令正在生成中，请稍候');
        return;
      }

      try {
        await navigator.clipboard.writeText(cmd);
        const originalText = copyCmd.textContent;
        copyCmd.textContent = '✓ 已复制';
        copyCmd.style.background = '#28a745';
        setTimeout(() => {
          copyCmd.textContent = originalText;
          copyCmd.style.background = '';
        }, 2000);
      } catch(e) {
        // 降级方案
        const range = document.createRange();
        range.selectNode(deployCmd);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
      }
    });
  }

  // 点击命令选中文本
  deployCmd.addEventListener('click', function(){
    const range = document.createRange();
    range.selectNode(this);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
  });

  // 初始化生成命令
  updateCommand();

  console.log('[命令生成器] 初始化完成');
}
