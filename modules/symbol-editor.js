// 符号编辑器模块
import { el } from './utils.js';

// 默认符号配置
export const defaultSymbolConfig = {
  ',': { half: ['，'], full: ['，'], paired: false },
  '.': { half: ['。'], full: ['。'], paired: false },
  '<': { half: ['《', '〈', '«', '‹'], full: ['《', '〈', '«', '‹'], paired: true },
  '>': { half: ['》', '〉', '»', '›'], full: ['》', '〉', '»', '›'], paired: true },
  '/': { half: ['、', '/', '／', '÷'], full: ['／', '÷'], paired: false },
  '?': { half: ['？'], full: ['？'], paired: false },
  ';': { half: ['；'], full: ['；'], paired: false },
  ':': { half: ['：'], full: ['：'], paired: false },
  "'": { half: [''', '''], full: [''', '''], paired: true },
  '"': { half: ['"', '"'], full: ['"', '"'], paired: true },
  '\\': { half: ['、', '\\', '＼'], full: ['、', '＼'], paired: false },
  '|': { half: ['·', '|', '｜', '§', '¦'], full: ['·', '｜', '§', '¦'], paired: false },
  '`': { half: ['`'], full: ['｀'], paired: false },
  '~': { half: ['~', '～'], full: ['～'], paired: false },
  '!': { half: ['！'], full: ['！'], paired: false },
  '@': { half: ['@'], full: ['＠', '☯'], paired: false },
  '#': { half: ['#'], full: ['＃', '⌘'], paired: false },
  '%': { half: ['%', '％', '°', '℃'], full: ['％', '°', '℃'], paired: false },
  '$': { half: ['￥', '$', '€', '£', '¥', '¢', '¤'], full: ['￥', '$', '€', '£', '¥', '¢', '¤'], paired: false },
  '^': { half: ['……'], full: ['……'], paired: false },
  '&': { half: ['&'], full: ['＆'], paired: false },
  '*': { half: ['*', '＊', '·', '・', '×', '※', '❂'], full: ['＊', '·', '・', '×', '※', '❂'], paired: false },
  '(': { half: ['（'], full: ['（'], paired: true },
  ')': { half: ['）'], full: ['）'], paired: true },
  '-': { half: ['-'], full: ['－'], paired: false },
  '_': { half: ['——'], full: ['——'], paired: false },
  '+': { half: ['+'], full: ['＋'], paired: false },
  '=': { half: ['='], full: ['＝'], paired: false },
  '[': { half: ['「', '【', '〔', '［'], full: ['「', '【', '〔', '［'], paired: true },
  ']': { half: ['」', '】', '〕', '］'], full: ['」', '】', '〕', '］'], paired: true },
  '{': { half: ['『', '〖', '｛'], full: ['『', '〖', '｛'], paired: true },
  '}': { half: ['』', '〗', '｝'], full: ['』', '〗', '｝'], paired: true }
};

// 当前符号配置
let currentSymbolConfig = JSON.parse(localStorage.getItem('symbolConfig') || JSON.stringify(defaultSymbolConfig));

// 初始化符号编辑器
export function initSymbolEditor() {
  const btnConfig = el('btnConfigSymbols');
  const modal = el('symbolModal');
  const closeBtn = el('closeSymbolModal');
  const cancelBtn = el('cancelSymbols');
  const saveBtn = el('saveSymbols');
  const resetBtn = el('resetSymbols');
  const importBtn = el('importSymbols');
  const exportBtn = el('exportSymbols');
  const englishOnlyCheckbox = el('englishOnly');

  if (!btnConfig || !modal) return;

  // 打开弹窗
  btnConfig.addEventListener('click', () => {
    modal.style.display = 'block';
    renderSymbolTable();
  });

  // 关闭弹窗
  const closeModal = () => {
    modal.style.display = 'none';
  };

  closeBtn.addEventListener('click', closeModal);
  cancelBtn.addEventListener('click', closeModal);

  // 点击背景关闭
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // 保存配置
  saveBtn.addEventListener('click', () => {
    saveSymbolConfig();
    closeModal();
  });

  // 恢复默认
  resetBtn.addEventListener('click', () => {
    if (confirm('确定要恢复默认符号配置吗？')) {
      currentSymbolConfig = JSON.parse(JSON.stringify(defaultSymbolConfig));
      localStorage.setItem('symbolConfig', JSON.stringify(currentSymbolConfig));
      renderSymbolTable();
    }
  });

  // 导出配置
  exportBtn.addEventListener('click', () => {
    const configStr = JSON.stringify(currentSymbolConfig, null, 2);
    const blob = new Blob([configStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'symbol-config.json';
    a.click();
    URL.revokeObjectURL(url);
  });

  // 导入配置
  importBtn.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const config = JSON.parse(e.target.result);
            currentSymbolConfig = config;
            localStorage.setItem('symbolConfig', JSON.stringify(config));
            renderSymbolTable();
            alert('符号配置导入成功！');
          } catch (err) {
            alert('配置文件格式错误！');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  });

  // 只使用英文符号
  englishOnlyCheckbox.addEventListener('change', () => {
    const isChecked = englishOnlyCheckbox.checked;
    const inputs = document.querySelectorAll('#symbolTableBody input[type="text"]');
    inputs.forEach(input => {
      input.disabled = isChecked;
    });
  });
}

// 渲染符号表格
function renderSymbolTable() {
  const tbody = el('symbolTableBody');
  if (!tbody) return;

  tbody.innerHTML = '';

  Object.entries(currentSymbolConfig).forEach(([key, config]) => {
    const tr = document.createElement('tr');

    // 成对符号使用绿色背景
    const bgColor = config.paired ? '#f0fff4' : '';

    tr.innerHTML = `
      <td style="padding:8px;border:1px solid #e8e8e8;font-family:monospace;font-size:16px;text-align:center;background:${bgColor}">
        <strong>${key}</strong>
      </td>
      <td style="padding:8px;border:1px solid #e8e8e8;background:${bgColor}">
        <input type="text"
          data-symbol="${key}"
          data-type="half"
          value="${config.half.join(' ')}"
          style="width:100%;padding:4px;border:1px solid #d9d9d9;border-radius:2px;font-size:14px"
          placeholder="空格分隔多个候选项"
        />
      </td>
      <td style="padding:8px;border:1px solid #e8e8e8;background:${bgColor}">
        <input type="text"
          data-symbol="${key}"
          data-type="full"
          value="${config.full.join(' ')}"
          style="width:100%;padding:4px;border:1px solid #d9d9d9;border-radius:2px;font-size:14px"
          placeholder="空格分隔多个候选项"
        />
      </td>
      <td style="padding:8px;border:1px solid #e8e8e8;text-align:center;background:${bgColor}">
        ${config.paired ? '✅' : ''}
      </td>
    `;

    tbody.appendChild(tr);
  });
}

// 保存符号配置
function saveSymbolConfig() {
  const inputs = document.querySelectorAll('#symbolTableBody input[type="text"]');

  inputs.forEach(input => {
    const symbol = input.dataset.symbol;
    const type = input.dataset.type;
    const values = input.value.trim().split(/\s+/).filter(v => v);

    if (currentSymbolConfig[symbol]) {
      currentSymbolConfig[symbol][type] = values.length > 0 ? values : [symbol];
    }
  });

  localStorage.setItem('symbolConfig', JSON.stringify(currentSymbolConfig));
}

// 获取当前符号配置
export function getSymbolConfig() {
  return currentSymbolConfig;
}

// 检查是否只使用英文符号
export function isEnglishOnly() {
  const checkbox = el('englishOnly');
  return checkbox ? checkbox.checked : false;
}