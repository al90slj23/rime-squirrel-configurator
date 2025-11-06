// 下载功能模块
import { el, download } from './utils.js';
import { renderYaml, renderSquirrelYaml, generateEmojiDict, generateRimeLua } from './config.js';

// 初始化下载功能
export function initDownload() {
  const btnDownloadZip = el('btnDownloadZip');
  const btnDownloadFiles = el('btnDownloadFiles');

  // 下载压缩配置包
  if (btnDownloadZip) {
    btnDownloadZip.addEventListener('click', async () => {
      try {
        const schemaId = el('schemaId');
        const enableEmoji = el('enableEmoji');
        const enableLunar = el('enableLunar');

        const zip = new JSZip();
        const schemaName = schemaId?.value || 'luna_pinyin';

        // 1. 添加方案配置文件
        const yamlObj = renderYaml();
        const yamlText = jsyaml.dump(yamlObj, { lineWidth: 120 });
        zip.file(`${schemaName}.custom.yaml`, yamlText);

        // 2. 添加皮肤配置文件
        const squirrelObj = renderSquirrelYaml();
        const squirrelText = jsyaml.dump(squirrelObj, { lineWidth: 120 });
        zip.file('squirrel.custom.yaml', squirrelText);

        // 3. 如果启用了 Emoji，添加 emoji 词库
        if (enableEmoji?.checked) {
          const emojiDict = generateEmojiDict();
          zip.file('emoji.dict.yaml', emojiDict);
        }

        // 4. 如果启用了农历或 Emoji，添加 rime.lua
        if (enableLunar?.checked || enableEmoji?.checked) {
          const rimeLua = generateRimeLua();
          zip.file('rime.lua', rimeLua);
        }

        // 5. 生成并下载 zip 文件
        const blob = await zip.generateAsync({ type: 'blob' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `rime-config-${schemaName}.zip`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        console.log('[下载] 压缩包下载完成');
      } catch (error) {
        console.error('[下载] 压缩包下载失败:', error);
        alert('下载失败，请检查浏览器控制台');
      }
    });
  }

  // 下载完整配置（分别下载多个文件）
  if (btnDownloadFiles) {
    btnDownloadFiles.addEventListener('click', () => {
      try {
        const schemaId = el('schemaId');
        const enableEmoji = el('enableEmoji');
        const enableLunar = el('enableLunar');

        const schemaName = schemaId?.value || 'luna_pinyin';

        // 1. 下载方案配置
        const yamlObj = renderYaml();
        const yamlText = jsyaml.dump(yamlObj, { lineWidth: 120 });
        download(yamlText, `${schemaName}.custom.yaml`);

        // 2. 下载皮肤配置
        setTimeout(() => {
          const squirrelObj = renderSquirrelYaml();
          const squirrelText = jsyaml.dump(squirrelObj, { lineWidth: 120 });
          download(squirrelText, 'squirrel.custom.yaml');
        }, 200);

        // 3. 下载 Emoji 词库（如果启用）
        if (enableEmoji?.checked) {
          setTimeout(() => {
            const emojiDict = generateEmojiDict();
            download(emojiDict, 'emoji.dict.yaml');
          }, 400);
        }

        // 4. 下载 Lua 脚本（如果启用）
        if (enableLunar?.checked || enableEmoji?.checked) {
          setTimeout(() => {
            const rimeLua = generateRimeLua();
            download(rimeLua, 'rime.lua');
          }, 600);
        }

        console.log('[下载] 所有文件下载完成');
      } catch (error) {
        console.error('[下载] 文件下载失败:', error);
        alert('下载失败，请检查浏览器控制台');
      }
    });
  }

  console.log('[下载] 下载模块已初始化');
}
