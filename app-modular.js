// 模块化入口文件 - 仅负责新的命令生成器功能
// 注意：主界面功能（主题、快捷键、下载等）由 app.js 处理
import { initCommandGenerator } from './modules/command-generator.js';

// 使用延迟加载，等待 app.js 初始化完成
setTimeout(() => {
  console.log('[命令生成器模块] 启动');

  // 只初始化命令生成器（不重复初始化其他功能）
  initCommandGenerator();
  console.log('[命令生成器模块] 加载完成');
}, 500);
