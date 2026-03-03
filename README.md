# mastodon-comments

基于 Tailwind CSS 构建的 Mastodon 评论区组件，无需后端服务即可部署在任何网站，评论数据存储在 Mastodon 服务器中。

## 🌟 特性
- ✅ 免后端部署，纯前端实现
- ✅ 基于 Mastodon API 获取评论数据
- ✅ 支持两级评论展示
- ✅ 响应式设计（适配移动端/桌面端）
- ✅ 加载状态/空状态/错误状态提示
- ✅ 支持评论重试加载

## 🎮 在线演示
[查看 Demo](https://feiju12138.github.io/mastodon-comments/demo/)

## 🚀 快速使用

### 浏览器

```html
<!-- 1. 引入外部依赖 -->
<script src="https://cdn.tailwindcss.com"></script>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">

<!-- 2. 创建挂载点 -->
<div id="mastodon-comments"></div>

<!-- 3. 通过CDN引入组件 -->
<script src="https://cdn.jsdelivr.net/gh/feiju12138/mastodon-comments@main/dist/mastodon-comments.js"></script>

<!-- 4. 初始化组件 -->
<script>
  document.addEventListener('DOMContentLoaded', function() {
    initMastodonComments({
      MASTODON_DOMAIN: "mastodon.social", // Mastodon 实例域名
      MASTODON_USER: "feiju", // Mastodon 实例中根评论发布的用户名
      TOOT_ID: "116164221651686918" // 你的 Toot ID
    });
  });
</script>
```
