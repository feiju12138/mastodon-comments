module.exports = {
  content: [
    './src/**/*.html',
    './src/**/*.js' // 扫描JS/HTML中的Tailwind类名
  ],
  theme: {
    extend: {
      animation: {
        'spin': 'spin 1s linear infinite', // 补充旋转动画（适配加载图标）
      },
      keyframes: {
        spin: {
          '0%': {transform: 'rotate(0deg)'},
          '100%': {transform: 'rotate(360deg)'},
        }
      }
    }
  }
};
