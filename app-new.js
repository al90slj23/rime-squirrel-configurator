// 完全模块化的入口文件
import { initTheme } from './modules/theme.js';
import { initHotkeys } from './modules/hotkeys.js';
import { initCommandGenerator } from './modules/command-generator.js';
import { el, getSimpDefault, getSelectLabels, download } from './modules/utils.js';

document.addEventListener('DOMContentLoaded', () => {
  console.log('[App] 完全模块化版本启动');

  // 获取所有元素引用
  const elements = {
    schemaId: el('schemaId'),
    outName: el('outName'),
    hotkey: el('hotkey'),
    hotkeySwitch: el('hotkeySwitch'),
    hotkeyAscii: el('hotkeyAscii'),
    hotkeyCapsLock: el('hotkeyCapsLock'),
    hotkeyFullShape: el('hotkeyFullShape'),
    asciiMode: el('asciiMode'),
    fullShape: el('fullShape'),
    asciiPunct: el('asciiPunct'),
    pageSize: el('pageSize'),
    customLabels: el('customLabels'),
    customLabelsWrap: el('customLabelsWrap'),
    asciiComposer: el('asciiComposer'),
    enableEmail: el('enableEmail'),
    enableUrl: el('enableUrl'),
    enableUppercase: el('enableUppercase'),
    enablePunctuator: el('enablePunctuator'),
    enableEmoji: el('enableEmoji'),
    enableLunar: el('enableLunar'),
    enableSymbols: el('enableSymbols'),
    colorScheme: el('colorScheme'),
    colorSchemeDark: el('colorSchemeDark'),
    fontFace: el('fontFace'),
    fontSize: el('fontSize'),
    cornerRadius: el('cornerRadius'),
    lineSpacing: el('lineSpacing'),
    spacing: el('spacing'),
    inlinePreedit: el('inlinePreedit'),
    preview: el('preview'),
    drop: el('drop')
  };

  // 初始化各个模块
  initTheme();
  initHotkeys();
  initCommandGenerator();

  // 初始化其他UI功能
  initUIFeatures(elements);

  // 初始化下载功能
  initDownloadFeatures(elements);

  console.log('[App] 所有模块加载完成');
});

// UI交互功能
function initUIFeatures(elements) {
  // 切换自定义标签输入框显示
  document.querySelectorAll('input[name="selectLabels"]').forEach(radio => {
    radio.addEventListener('change', () => {
      if (elements.customLabelsWrap) {
        elements.customLabelsWrap.style.display = radio.value === 'custom' ? 'block' : 'none';
      }
    });
  });

  // 预览类型切换
  document.querySelectorAll('input[name="previewType"]')?.forEach(radio => {
    radio.addEventListener('change', () => updatePreview(elements));
  });

  // 拖拽读取配置文件
  if (elements.drop) {
    elements.drop.addEventListener('dragover', (e) => {
      e.preventDefault();
      elements.drop.style.borderColor = '#007aff';
    });

    elements.drop.addEventListener('dragleave', () => {
      elements.drop.style.borderColor = 'var(--border)';
    });

    elements.drop.addEventListener('drop', (e) => {
      e.preventDefault();
      elements.drop.style.borderColor = 'var(--border)';
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        const file = files[0];
        const reader = new FileReader();
        reader.onload = (evt) => {
          try {
            parseYamlAndFill(evt.target.result, elements);
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

// 下载功能（简化版 - 完整版需要从 app.js 迁移）
function initDownloadFeatures(elements) {
  const btnDownloadZip = el('btnDownloadZip');
  const btnDownloadFiles = el('btnDownloadFiles');

  if (btnDownloadZip) {
    btnDownloadZip.addEventListener('click', () => {
      alert('下载功能正在迁移中，请使用"生成部署命令"功能');
    });
  }

  if (btnDownloadFiles) {
    btnDownloadFiles.addEventListener('click', () => {
      alert('下载功能正在迁移中，请使用"生成部署命令"功能');
    });
  }
}

// 预览更新
function updatePreview(elements) {
  if (!elements.preview) return;
  const previewType = document.querySelector('input[name="previewType"]:checked')?.value || 'schema';
  elements.preview.textContent = `预览功能开发中 - ${previewType}`;
}

// YAML解析（简化版）
function parseYamlAndFill(yamlText, elements) {
  console.log('[App] 解析YAML:', yamlText.substring(0, 100));
  alert('YAML解析功能开发中');
}
