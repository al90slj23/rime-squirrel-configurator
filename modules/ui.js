// UI交互模块
import { el } from './utils.js';

// 初始化UI交互功能
export function initUI() {
  initCustomLabelsToggle();
  initDragDrop();
  console.log('[UI] UI交互模块已初始化');
}

// 自定义标签切换
function initCustomLabelsToggle() {
  const customLabelsWrap = el('customLabelsWrap');
  if (!customLabelsWrap) return;

  document.querySelectorAll('input[name="selectLabels"]').forEach(radio => {
    radio.addEventListener('change', () => {
      customLabelsWrap.style.display = radio.value === 'custom' ? 'block' : 'none';
    });
  });
}

// 拖拽上传配置文件
function initDragDrop() {
  const drop = el('drop');
  if (!drop) return;

  drop.addEventListener('dragover', (e) => {
    e.preventDefault();
    drop.style.borderColor = '#007aff';
  });

  drop.addEventListener('dragleave', () => {
    drop.style.borderColor = 'var(--border)';
  });

  drop.addEventListener('drop', (e) => {
    e.preventDefault();
    drop.style.borderColor = 'var(--border)';

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          parseYamlAndFill(evt.target.result);
          alert('✓ 已读取配置文件');
        } catch (err) {
          console.error('[UI] YAML解析失败:', err);
          alert('读取失败：' + err.message);
        }
      };
      reader.readAsText(file);
    }
  });
}

// YAML解析并填充表单（简化版）
function parseYamlAndFill(yamlText) {
  console.log('[UI] 解析YAML配置，长度:', yamlText.length);

  // TODO: 实现完整的YAML解析逻辑
  // 这里需要使用 js-yaml 库解析，然后填充到各个表单元素

  throw new Error('YAML解析功能待实现');
}
