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
      const testModal = document.getElementById('symbolModal');

      if (testBtn) {
        console.log('[测试] 符号配置按钮存在:', testBtn);
        console.log('[测试] 按钮HTML:', testBtn.outerHTML);
        console.log('[测试] 按钮样式display:', window.getComputedStyle(testBtn).display);
        console.log('[测试] 按钮样式visibility:', window.getComputedStyle(testBtn).visibility);

        // 添加一个额外的点击监听器用于调试
        testBtn.addEventListener('click', (e) => {
          console.log('[测试] 额外监听器: 符号配置按钮被点击了！', e);

          // 直接尝试显示弹窗
          const modal = document.getElementById('symbolModal');
          if (modal) {
            console.log('[测试] 找到弹窗，尝试显示');
            console.log('[测试] 弹窗当前display:', modal.style.display);
            modal.style.display = 'block';
            modal.style.zIndex = '9999'; // 确保在最上层
            console.log('[测试] 弹窗设置后display:', modal.style.display);

            // 检查弹窗的实际可见性
            const modalRect = modal.getBoundingClientRect();
            console.log('[测试] 弹窗位置:', modalRect);
            console.log('[测试] 弹窗computed style:', window.getComputedStyle(modal));
          } else {
            console.error('[测试] 弹窗元素不存在！');
          }
        });

        // 测试直接触发点击
        console.log('[测试] 2秒后将自动触发按钮点击进行测试...');
        setTimeout(() => {
          console.log('[测试] 自动触发点击');
          testBtn.click();
        }, 2000);

      } else {
        console.error('[测试] 符号配置按钮未找到');
      }

      if (testModal) {
        console.log('[测试] 符号弹窗存在:', testModal);
        console.log('[测试] 弹窗初始display:', testModal.style.display);
      } else {
        console.error('[测试] 符号弹窗未找到');
      }
    }, 100);

    console.log('%c[Rime配置器] 所有模块加载完成！', 'color: #28a745; font-weight: bold');
  } catch (error) {
    console.error('%c[Rime配置器] 初始化失败:', 'color: #dc3545; font-weight: bold', error);
    alert('应用初始化失败，请刷新页面重试');
  }
});
