export const icons = {
  // 外部链接图标 (fa-external-link-alt)
  externalLink: `
    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-external-link" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
      <path d="M12 6h-6a2 2 0 0 0 -2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-6" />
      <path d="M11 13l9 -9" />
      <path d="M15 4h5v5" />
    </svg>
  `,
  // 加载中旋转图标 (fa-spinner)
  spinner: `
    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-loader" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
      <path d="M12 6v1m0 5v1" />
      <path d="M5.6 5.6l.7 .7m7.1 7.1l.7 .7" />
      <path d="M6 12h1m5 0h1" />
      <path d="M16.4 5.6l.7 -.7m-7.1 7.1l.7 -.7" />
      <path d="M18 12h1m-5 5h1" />
      <path d="M16.4 18.4l.7 -.7m-7.1 -7.1l.7 -.7" />
    </svg>
  `,
  // 暂无评论图标 (fa-comment-dots)
  commentDots: `
    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-message-circle" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
      <path d="M3 20l1.3 -3.9a9 8 0 1 1 3.4 2.9l-4.7 1" />
    </svg>
  `,
  // 错误提示图标 (fa-triangle-exclamation)
  triangleExclamation: `
    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-triangle-alert" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
      <path d="M12 9v2m0 4v.01" />
      <path d="M10.24 3.95l-8.48 14.05l18 -10l-9.52 -4.05z" />
    </svg>
  `
};

// 生成带旋转动画的加载图标（复用spinner）
export const spinnerWithAnimation = icons.spinner.replace('<svg', '<svg class="animate-spin"');
