// 预览功能模块
import { el } from './utils.js';
import { renderYaml, renderSquirrelYaml } from './config.js';

// 初始化预览功能
export function initPreview() {
  const preview = el('preview');
  if (!preview) return;

  // 预览类型切换
  document.querySelectorAll('input[name="previewType"]').forEach(radio => {
    radio.addEventListener('change', updatePreview);
  });

  // 初始化预览
  updatePreview();

  console.log('[预览] 预览模块已初始化');
}

// 更新预览
function updatePreview() {
  const preview = el('preview');
  if (!preview) return;

  const previewType = document.querySelector('input[name="previewType"]:checked')?.value || 'schema';

  try {
    let yamlText = '';

    if (previewType === 'schema') {
      const yamlObj = renderYaml();
      yamlText = jsyaml.dump(yamlObj, { lineWidth: 120 });
    } else if (previewType === 'squirrel') {
      const squirrelObj = renderSquirrelYaml();
      yamlText = jsyaml.dump(squirrelObj, { lineWidth: 120 });
    }

    preview.textContent = yamlText;
  } catch (error) {
    console.error('[预览] 预览更新失败:', error);
    preview.textContent = '预览生成失败：' + error.message;
  }
}
