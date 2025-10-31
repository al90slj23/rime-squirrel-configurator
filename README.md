# Rime 鼠须管可视化配置器

一个现代化的 Web 界面工具，用于可视化配置 Rime 输入法（鼠须管）的输入方案和外观皮肤。

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ 功能特性

### 📝 输入方案配置 (`*.schema.custom.yaml`)

- **基础设置**
  - 方案标识配置（支持朙月拼音等所有 Rime 方案）
  - 简繁体优先级设置
  - 输入模式配置（中西文、全半角、标点）

- **热键配置**
  - 简繁切换热键自定义
  - 支持多组快捷键组合

- **候选词设置**
  - 每页候选词数量（1-10 个）
  - 候选词标签自定义（数字或字母）

- **高级功能**
  - ASCII Composer 配置（Caps Lock 传统行为）
  - 智能识别器（邮箱、URL、大写字母自动识别）

### 🎨 鼠须管皮肤配置 (`squirrel.custom.yaml`)

- **20+ 预设配色方案**
  - **浅色主题**：Google、碧水 Aqua、青天 Azure、明月 Luna、墨池 Ink 等
  - **深色主题**：暗堂 Dark Temple、Mojave Dark、Solarized Dark 等
  - 支持浅色/深色模式自动切换

- **候选窗口布局**
  - 横向/纵向排列
  - 单行/双行显示模式

- **字体自定义**
  - 主字体选择（PingFangSC、STHeiti、Hiragino Sans GB 等）
  - 字体大小调节（10-36px）

- **窗口外观**
  - 圆角半径调节（0-20px）
  - 行间距、候选词间距精细控制

## 🚀 快速开始

### 打开配置器

**方式 1：双击打开**
```bash
/Users/al90slj23/Library/Rime/Rime管须鼠配置器/Rime管须鼠配置器.html
```

**方式 2：浏览器直接访问**
将 `Rime管须鼠配置器.html` 拖拽到浏览器窗口

**方式 3：命令行打开**
```bash
open ~/Library/Rime/Rime管须鼠配置器/Rime管须鼠配置器.html
```

### 配置步骤

#### 1️⃣ 配置输入方案

1. 在「方案配置」部分设置：
   - 方案标识（如 `luna_pinyin`）
   - 简繁体优先级
   - 输入模式和热键

2. 在「候选词设置」调整：
   - 每页候选词数量
   - 候选词标签样式

3. 点击 **⬇ 生成方案配置** 下载 `luna_pinyin.custom.yaml`

#### 2️⃣ 配置皮肤外观

1. 在「鼠须管皮肤配置」选择：
   - 浅色模式主题
   - 深色模式主题

2. 调整候选窗口：
   - 横向/纵向布局
   - 单行模式开关

3. 自定义字体和外观：
   - 字体名称和大小
   - 圆角、间距等细节

4. 点击 **⬇ 生成皮肤配置** 下载 `squirrel.custom.yaml`

#### 3️⃣ 部署配置

**方式 1：手动部署**
1. 将下载的配置文件放入 `~/Library/Rime/` 目录
2. 点击菜单栏鼠须管图标
3. 选择「重新部署」

**方式 2：命令行部署**
```bash
# 将下载的文件移动到 Rime 目录
mv ~/Downloads/*.custom.yaml ~/Library/Rime/

# 重新部署
/Library/Input\ Methods/Squirrel.app/Contents/MacOS/Squirrel --reload
```

## 📋 配置文件说明

### 输入方案配置文件

- **文件名格式**：`{方案名}.custom.yaml`
  - 例如：`luna_pinyin.custom.yaml`（朙月拼音）
  - 例如：`double_pinyin.custom.yaml`（双拼）

- **配置内容**：
  ```yaml
  patch:
    schema:
      name: 朙月拼音（簡體優先）
    switches: [...]
    menu:
      page_size: 9
      alternative_select_labels: [1,2,3,4,5,6,7,8,9]
    ascii_composer:
      good_old_caps_lock: true
    recognizer:
      patterns: [...]
  ```

### 皮肤配置文件

- **文件名**：`squirrel.custom.yaml`（固定名称）

- **配置内容**：
  ```yaml
  patch:
    show_notifications_when: appropriate
    style:
      color_scheme: google
      color_scheme_dark: dark_temple
      candidate_list_layout: linear
      font_face: PingFangSC
      font_point: 16
      corner_radius: 5
      line_spacing: 5
      spacing: 8
  ```

## 🎯 高级功能

### 载入现有配置

1. 拖拽现有的 `*.custom.yaml` 文件到「载入现有配置」区域
2. 配置器会自动解析并填充所有配置项
3. 可以在原有配置基础上进行修改

### 实时预览

- 切换「方案配置预览」和「皮肤配置预览」
- 实时查看生成的 YAML 配置内容
- 所有修改即时反映在预览区域

### 一键复制部署命令

在「部署说明」区域，点击 **📋 复制** 按钮即可复制部署命令，然后粘贴到终端执行。

## 📚 常见配色主题预览

| 主题名称 | 适用场景 | 特点 |
|---------|---------|------|
| Google | 日常使用 | 清爽、简洁 |
| Aqua（碧水） | 浅色主题 | 清新、柔和 |
| Azure（青天） | 浅色主题 | 明亮、清晰 |
| Luna（明月） | 浅色主题 | 优雅、舒适 |
| Dark Temple（暗堂） | 深色主题 | 护眼、沉稳 |
| Mojave Dark | 深色主题 | 与 macOS 深色模式完美搭配 |
| StarCraft（星际争霸） | 游戏风格 | 科幻、个性 |
| Solarized 系列 | 专业开发 | 低对比度、护眼 |

## 🛠️ 技术栈

- **纯前端实现**：无需服务器，完全离线可用
- **js-yaml**：YAML 解析和生成
- **原生 JavaScript**：无框架依赖
- **响应式设计**：支持移动端和桌面端

## 📖 相关文档

- [Rime 官方文档](https://rime.im/docs/)
- [鼠须管输入法](https://github.com/rime/squirrel)
- [Rime 定制指南](https://github.com/rime/home/wiki/CustomizationGuide)
- [配色方案参考](https://github.com/LEOYoon-Tsaw/Rime_collections/blob/master/鼠鬚管介面配置指南.md)

## ⚠️ 注意事项

1. **备份配置**：修改配置前建议备份 `~/Library/Rime/` 目录
2. **配置冲突**：如果有多个 `.custom.yaml` 文件配置了相同项，后加载的会覆盖先加载的
3. **重新部署**：每次修改配置后都需要重新部署才能生效
4. **字体支持**：确保系统中已安装配置的字体，否则会使用默认字体

## 🐛 故障排查

### 配置不生效？

1. 检查文件名是否正确（`{方案名}.custom.yaml` 或 `squirrel.custom.yaml`）
2. 确认文件已放入 `~/Library/Rime/` 目录
3. 执行「重新部署」操作
4. 查看 `~/Library/Rime/` 目录下的日志文件排查错误

### 皮肤显示异常？

1. 确认 `squirrel.custom.yaml` 文件内容格式正确
2. 尝试切换到其他预设主题
3. 检查字体是否已安装
4. 重启输入法或重新登录系统

### 候选词不显示？

1. 检查 `page_size` 设置是否合理（建议 5-9）
2. 确认方案配置文件名与实际方案标识匹配
3. 查看是否有其他配置文件冲突

## 💡 使用技巧

1. **快速试色**：可以先下载 `squirrel.custom.yaml`，测试不同配色方案，找到喜欢的再配置其他选项
2. **多方案管理**：为不同输入方案生成不同的配置文件，按需使用
3. **配置版本控制**：将配置文件加入 Git 管理，方便同步和回滚
4. **导出分享**：可以将自定义的配置文件导出，分享给其他用户

## 📝 版本历史

### v1.0.0 (2025-10-31)
- ✨ 初始版本发布
- 🎨 支持 20+ 预设配色方案
- 📝 完整的输入方案配置功能
- 🖥️ 响应式界面设计
- 📦 双文件生成（方案配置 + 皮肤配置）

## 📄 许可证

MIT License - 自由使用、修改和分发

## 🙏 致谢

- [Rime](https://rime.im/) - 优秀的开源输入法引擎
- [鼠须管](https://github.com/rime/squirrel) - macOS 平台前端
- 所有贡献配色方案和配置文件的社区成员

---

**Made with ❤️ for Rime Users**

如有问题或建议，欢迎提出 Issue 或 Pull Request！
