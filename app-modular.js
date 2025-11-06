// 模块化入口文件
import { initTheme } from './modules/theme.js';
import { initHotkeys } from './modules/hotkeys.js';
import { initCommandGenerator } from './modules/command-generator.js';

document.addEventListener('DOMContentLoaded', () => {
  console.log('[App] 模块化应用启动');

  // 初始化主题
  initTheme();
  console.log('[App] 主题模块已加载');

  // 初始化快捷键
  initHotkeys();
  console.log('[App] 快捷键模块已加载');

  // 初始化命令生成器
  initCommandGenerator();
  console.log('[App] 命令生成器已加载');

  // 初始化其他功能
  initOtherFeatures();
  console.log('[App] 所有模块加载完成');
});

function initOtherFeatures() {
  const el = (id) => document.getElementById(id);

  // 切换自定义标签输入框显示
  document.querySelectorAll('input[name="selectLabels"]').forEach(radio => {
    radio.addEventListener('change', () => {
      const customLabelsWrap = el('customLabelsWrap');
      if (customLabelsWrap) {
        customLabelsWrap.style.display = radio.value === 'custom' ? 'block' : 'none';
      }
    });
  });

  // 预览类型切换
  document.querySelectorAll('input[name="previewType"]')?.forEach(radio => {
    radio.addEventListener('change', updatePreview);
  });

  // 拖拽读取配置文件
  const drop = el('drop');
  if (drop) {
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
            alert('读取失败：' + err.message);
          }
        };
        reader.readAsText(file);
      }
    });
  }
}

// 简化的预览更新
function updatePreview() {
  const preview = document.getElementById('preview');
  if (!preview) return;

  const previewType = document.querySelector('input[name="previewType"]:checked')?.value || 'schema';
  preview.textContent = `预览: ${previewType} 配置`;
}

// 简化的YAML解析（实际应该使用完整的解析逻辑）
function parseYamlAndFill(yamlText) {
  console.log('[App] 解析YAML配置:', yamlText.substring(0, 100));
  // 这里可以添加完整的YAML解析和表单填充逻辑
}
