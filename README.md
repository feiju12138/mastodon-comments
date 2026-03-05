# Mastodon Comments

A Mastodon comment section component built with Tailwind CSS – backend-free deployment, with all data natively stored in Mastodon.
基于 Tailwind CSS 构建的 Mastodon 评论区组件，免后端部署，数据原生存储在 Mastodon 中。

## 🌟 特性

- ✅ 免后端部署，纯前端实现
- ✅ 基于 Mastodon API 获取评论数据
- ✅ 支持两级评论展示
- ✅ 响应式设计（适配移动端/桌面端）
- ✅ 加载状态/空状态/错误状态提示
- ✅ 支持评论重试加载
- ❌ 暂不支持渲染评论中包含的图片

## 🚀 快速使用

```html
<!-- 1. 引入外部依赖 -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/font-awesome@4.7.0/css/font-awesome.min.css">

<!-- 2. 创建挂载点 -->
<div id="mastodon-comments"></div>

<!-- 3. 通过CDN引入组件 -->
<script src="https://cdn.jsdelivr.net/gh/feiju12138/mastodon-comments@vlatest/dist/mastodon-comments.min.js"></script>

<!-- 4. 初始化组件 -->
<script>
  document.addEventListener("DOMContentLoaded", function() {
    initMastodonComments({
      MASTODON_DOMAIN: "mastodon.social", // Mastodon 实例域名
      MASTODON_USER: "feiju", // Mastodon 实例中根评论发布的用户名
      TOOT_ID: "116164221651686918" // 你的 Toot ID
    });
  });
</script>
```

## 🔧 本地开发 & 自定义构建

### 克隆项目

```shell
git clone https://github.com/feiju12138/mastodon-comments.git
cd mastodon-comments
```

### 安装依赖

```shell
npm install
```

### 修改源码并构建

```shell
npm run build
```

- `dist`目录下会生成产物
