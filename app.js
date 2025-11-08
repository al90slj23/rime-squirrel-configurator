// 完全模块化的 Rime 配置器
// 原 1100 行代码已拆分为模块

import { initTheme } from './modules/theme.js';
import { initHotkeys } from './modules/hotkeys.js';
import { initDownload } from './modules/download.js';
import { initPreview } from './modules/preview.js';
import { initUI } from './modules/ui.js';
import { initCommandGenerator } from './modules/command-generator.js';
import { initSymbolEditor } from './modules/symbol-editor.js';

document.addEventListener('DOMContentLoaded', () => {
  console.log('%c[Rime配置器] 完全模块化版本', 'color: #007aff; font-weight: bold');
  console.log('[Rime配置器] 开始初始化...');

  try {
    // 初始化主题
    initTheme();
    console.log('✓ 主题模块');

    // 初始化快捷键
    initHotkeys();
    console.log('✓ 快捷键模块');

    // 初始化下载功能
    initDownload();
    console.log('✓ 下载模块');

    // 初始化预览功能
    initPreview();
    console.log('✓ 预览模块');

    // 初始化UI交互
    initUI();
    console.log('✓ UI交互模块');

    // 初始化命令生成器
    initCommandGenerator();
    console.log('✓ 命令生成器模块');

    // 初始化符号编辑器
    initSymbolEditor();
    console.log('✓ 符号编辑器模块');

    // 测试按钮是否可点击
    setTimeout(() => {
      const testBtn = document.getElementById('btnConfigSymbols');
      if (testBtn) {
        console.log('[测试] 符号配置按钮存在');
        // 添加一个额外的点击监听器用于调试
        testBtn.addEventListener('click', () => {
          console.log('[测试] 符号配置按钮被点击了！');
        });
      } else {
        console.error('[测试] 符号配置按钮未找到');
      }
    }, 100);

    console.log('%c[Rime配置器] 所有模块加载完成！', 'color: #28a745; font-weight: bold');
  } catch (error) {
    console.error('%c[Rime配置器] 初始化失败:', 'color: #dc3545; font-weight: bold', error);
    alert('应用初始化失败，请刷新页面重试');
  }
});
