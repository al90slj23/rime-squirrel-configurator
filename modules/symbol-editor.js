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
  console.log('[符号编辑器] 开始初始化');

  // 延迟执行，确保DOM完全加载
  setTimeout(() => {
    try {
      const btnConfig = document.getElementById('btnConfigSymbols');
      const modal = document.getElementById('symbolModal');
      const closeBtn = document.getElementById('closeSymbolModal');
      const cancelBtn = document.getElementById('cancelSymbols');
      const saveBtn = document.getElementById('saveSymbols');
      const resetBtn = document.getElementById('resetSymbols');
      const importBtn = document.getElementById('importSymbols');
      const exportBtn = document.getElementById('exportSymbols');
      const englishOnlyCheckbox = document.getElementById('englishOnly');

      console.log('[符号编辑器] 按钮元素:', btnConfig);
      console.log('[符号编辑器] 弹窗元素:', modal);

      if (!btnConfig) {
        console.error('[符号编辑器] 配置按钮未找到 (btnConfigSymbols)');
        return;
      }

      if (!modal) {
        console.error('[符号编辑器] 弹窗元素未找到 (symbolModal)');
        return;
      }

      // 直接使用onclick确保事件绑定
      btnConfig.onclick = function(e) {
        console.log('[符号编辑器] 按钮被点击!');

        if (e) {
          e.preventDefault();
          e.stopPropagation();
        }

        // 显示弹窗
        modal.style.cssText = 'display: block !important; position: fixed !important; top: 0 !important; left: 0 !important; right: 0 !important; bottom: 0 !important; z-index: 10000 !important; background: rgba(0,0,0,0.5) !important;';

        console.log('[符号编辑器] 弹窗已设置为显示');

        // 渲染符号表格
        try {
          renderSymbolTable();
          console.log('[符号编辑器] 表格渲染完成');
        } catch (err) {
          console.error('[符号编辑器] 表格渲染错误:', err);
        }
      };

      console.log('[符号编辑器] onclick事件已绑定');

      // 关闭弹窗函数 - 需要清除所有强制设置的样式
      const closeModal = () => {
        console.log('[符号编辑器] 执行关闭弹窗');
        modal.style.cssText = 'display: none !important;';
        console.log('[符号编辑器] 弹窗已关闭');
      };

      // 关闭按钮
      if (closeBtn) {
        closeBtn.onclick = function(e) {
          console.log('[符号编辑器] 点击了关闭按钮');
          if (e) {
            e.preventDefault();
            e.stopPropagation();
          }
          closeModal();
        };
        console.log('[符号编辑器] 关闭按钮事件已绑定');
      } else {
        console.warn('[符号编辑器] 关闭按钮未找到');
      }

      // 取消按钮
      if (cancelBtn) {
        cancelBtn.onclick = function(e) {
          console.log('[符号编辑器] 点击了取消按钮');
          if (e) {
            e.preventDefault();
            e.stopPropagation();
          }
          closeModal();
        };
        console.log('[符号编辑器] 取消按钮事件已绑定');
      } else {
        console.warn('[符号编辑器] 取消按钮未找到');
      }

      // 点击背景关闭
      modal.onclick = function(e) {
        if (e.target === modal) {
          console.log('[符号编辑器] 点击了弹窗背景');
          closeModal();
        }
      };

      // 保存配置
      if (saveBtn) {
        saveBtn.onclick = function() {
          saveSymbolConfig();
          closeModal();
        };
      }

      // 恢复默认
      if (resetBtn) {
        resetBtn.onclick = function() {
          if (confirm('确定要恢复默认符号配置吗？')) {
            currentSymbolConfig = JSON.parse(JSON.stringify(defaultSymbolConfig));
            localStorage.setItem('symbolConfig', JSON.stringify(currentSymbolConfig));
            renderSymbolTable();
          }
        };
      }

      // 导出配置
      if (exportBtn) {
        exportBtn.onclick = function() {
          const configStr = JSON.stringify(currentSymbolConfig, null, 2);
          const blob = new Blob([configStr], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'symbol-config.json';
          a.click();
          URL.revokeObjectURL(url);
        };
      }

      // 导入配置
      if (importBtn) {
        importBtn.onclick = function() {
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
        };
      }

      // 只使用英文符号
      if (englishOnlyCheckbox) {
        englishOnlyCheckbox.onchange = function() {
          const isChecked = englishOnlyCheckbox.checked;
          const inputs = document.querySelectorAll('#symbolTableBody input[type="text"]');
          inputs.forEach(input => {
            input.disabled = isChecked;
          });
        };
      }

      console.log('[符号编辑器] 初始化完成');

    } catch (error) {
      console.error('[符号编辑器] 初始化失败:', error);
      console.error('[符号编辑器] 错误堆栈:', error.stack);
    }
  }, 100); // 延迟100ms确保DOM完全加载
}

// 渲染符号表格
function renderSymbolTable() {
  console.log('[符号编辑器] 开始渲染符号表格');

  try {
    const tbody = el('symbolTableBody');
    if (!tbody) {
      console.error('[符号编辑器] 表格元素未找到 (symbolTableBody)');
      return;
    }

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

    console.log('[符号编辑器] 符号表格渲染完成');

  } catch (error) {
    console.error('[符号编辑器] 渲染符号表格失败:', error);
    console.error('[符号编辑器] 错误堆栈:', error.stack);
  }
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