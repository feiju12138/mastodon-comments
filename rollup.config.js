import terser from '@rollup/plugin-terser'; // 替换导入源
import resolve from '@rollup/plugin-node-resolve';

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/mastodon-comments.min.js',
    format: 'umd',
    name: 'MastodonComments',
    sourcemap: false
  },
  plugins: [
    resolve(),
    terser() // 用法和原来完全一致，无需其他修改
  ]
};
