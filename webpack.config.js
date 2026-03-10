const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'mastodon-comments.min.js',
    path: path.resolve(__dirname, 'dist'),
    library: {
      name: 'MastodonComments',
      type: 'umd', // 兼容浏览器/Node环境
      export: 'default'
    },
    clean: true // 构建前清空dist目录
  },
  module: {
    rules: [
      // 处理 JS/ES6 语法
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      // 处理 CSS + PostCSS (Tailwind)
      {
        test: /\.css$/i,
        use: [
          'style-loader', // 将CSS注入到DOM
          'css-loader',   // 解析@import和url()
          {
            loader: 'postcss-loader', // 处理PostCSS（Tailwind指令）
            options: {
              postcssOptions: {
                plugins: [
                  require('autoprefixer'), // 自动加浏览器前缀
                  require('tailwindcss')   // 解析@tailwind指令
                ]
              }
            }
          }
        ]
      }
    ]
  },
  plugins: [
    // 生成HTML模板（可选，用于本地测试）
    new HtmlWebpackPlugin({
      template: './src/index.html',
      minify: true // 生产环境压缩HTML
    })
  ],
  mode: 'production',
  devtool: 'source-map' // 生成sourcemap（可选）
};
