import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { terser } from "rollup-plugin-terser";
import banner from "rollup-plugin-banner";

// 读取 package.json 中的版本和作者信息
import pkg from "./package.json" with { type: "json" };

// 自定义 banner 内容（保留源码的版权信息）
const bannerText = `/**
 * Mastodon Comments - 基于 Mastodon API 的评论区组件
 * @version ${pkg.version || "1.0.0"}
 * @author ${pkg.author || "Your Name"}
 */`;

// 基础配置（适配自执行函数的浏览器组件）
const baseConfig = {
  input: "src/index.js", // 入口文件
  plugins: [
    nodeResolve({
      browser: true // 明确指定为浏览器环境
    }),
    commonjs(),
    banner(bannerText) // 添加版权注释到文件头部
  ],
  // 排除不需要打包的依赖（你的代码无外部依赖，这里仅作示例）
  external: [],
  // 禁止 Rollup 警告未使用的导出（因为你的代码是自执行函数，无显式导出）
  onwarn: (warning) => {
    if (warning.code === "UNUSED_EXTERNAL_IMPORT") return;
    console.warn(warning.message);
  }
};

// 导出多配置（生成未压缩和压缩版本）
export default [
  // 未压缩版本
  {
    ...baseConfig,
    output: {
      file: "dist/mastodon-comments.js",
      format: "iife", // 立即执行函数，最适配你的源码格式
      sourcemap: true, // 生成 sourcemap 方便调试
      // 禁用全局变量名（因为你的代码已通过自执行函数挂载到 window）
      name: undefined
    }
  },
  // 压缩版本
  {
    ...baseConfig,
    output: {
      file: "dist/mastodon-comments.min.js",
      format: "iife",
      sourcemap: true,
      name: undefined
    },
    plugins: [
      ...baseConfig.plugins,
      terser({
        // 压缩配置（适配浏览器环境）
        compress: {
          drop_console: false, // 保留 console.error 用于错误提示
          drop_debugger: true,
          pure_funcs: ["console.log"] // 仅移除 console.log
        },
        mangle: {
          // 避免混淆关键变量名
          reserved: ["MastodonComments", "initMastodonComments"]
        },
        format: {
          comments: /@version|@author/ // 保留版权注释
        }
      })
    ]
  }
];
