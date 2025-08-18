# ChromNav - 个人导航首页

一个基于 Vue3 + Vite 构建的静态导航首页，用于管理和快速访问常用链接。

## 功能特性

- 🚀 现代化的 UI 设计，支持响应式布局
- 📁 分组管理功能，可以将链接按类别组织
- ➕ 动态添加、编辑、删除分组和链接
- 🔍 自动获取网站图标
- 💾 本地存储，数据持久化
- 🌐 支持 GitHub Pages 部署

## 技术栈

- **Vue 3** - 渐进式 JavaScript 框架
- **Vite** - 下一代前端构建工具
- **CSS3** - 现代化样式，支持毛玻璃效果
- **GitHub Actions** - 自动化部署

## 快速开始

### 本地开发

1. 克隆项目
```bash
git clone https://github.com/你的用户名/chromNav.git
cd chromNav
```

2. 安装依赖
```bash
npm install
```

3. 启动开发服务器
```bash
npm run dev
```

4. 打开浏览器访问 `http://localhost:5173`

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## GitHub Pages 部署

1. 将代码推送到 GitHub 仓库
2. 在仓库设置中启用 GitHub Pages
3. 选择 "GitHub Actions" 作为部署源
4. 推送到 `main` 分支会自动触发部署

## 使用说明

### 添加分组

1. 点击页面中的 "添加新分组" 按钮
2. 填写分组名称和描述
3. 点击 "添加" 保存

### 管理链接

1. 在分组中点击 "添加链接" 按钮
2. 填写链接名称、URL 和描述
3. 系统会自动获取网站图标并显示预览
4. 点击 "添加" 保存

### 编辑和删除

- 每个分组和链接都有编辑和删除按钮
- 点击编辑按钮可以修改信息
- 点击删除按钮会弹出确认对话框

## 数据存储

项目使用浏览器的 `localStorage` 来存储数据，包括：
- 分组信息
- 链接信息
- 自动生成的 ID

## 自定义配置

### 修改基础路径

如果你的项目不是部署在根目录，需要修改 `vite.config.js` 中的 `base` 配置：

```javascript
export default defineConfig({
  base: '/你的项目名/',
  // ...
})
```

### 修改样式

主要样式文件：
- `src/style.css` - 全局样式
- 各组件的 `<style scoped>` 部分 - 组件样式

## 浏览器兼容性

- Chrome/Edge 88+
- Firefox 78+
- Safari 14+

## License

MIT License