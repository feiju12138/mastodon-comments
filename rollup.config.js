import { terser } from "rollup-plugin-terser";
import cleanup from "rollup-plugin-cleanup";
import banner2 from "rollup-plugin-banner2";
import fs from "fs";
import path from "path";

// 读取 package.json 信息
const pkg = JSON.parse(fs.readFileSync(path.resolve("./package.json"), "utf8"));

// 头部注释模板
const bannerTemplate = `/**
 * Mastodon Comments - ${pkg.description}
 * @version ${pkg.version || "1.0.0"}
 * @author ${pkg.author || "Unknown Author"}
 */
`;

// 基础配置：添加头部注释 + 删除所有源码注释和空行
const baseConfig = {
  input: "src/index.js",
  plugins: [
    banner2(() => bannerTemplate), // 先加头部注释
    cleanup({
      comments: "none", // 移除源码中所有注释（行注释/块注释）
      maxEmptyLines: 0  // 移除所有空行
    })
  ]
};

// 未压缩版本
const unminifiedConfig = {
  ...baseConfig,
  output: {
    file: "dist/mastodon-comments.js",
    format: "iife",
    name: "MastodonComments"
  }
};

// 压缩版本
const minifiedConfig = {
  ...baseConfig,
  output: {
    file: "dist/mastodon-comments.min.js",
    format: "iife",
    name: "MastodonComments"
  },
  plugins: [
    banner2(() => bannerTemplate),
    cleanup({ comments: "none", maxEmptyLines: 0 }),
    terser() // 压缩时会保留 banner 添加的块注释（/** ... */）
  ]
};

export default [unminifiedConfig, minifiedConfig];
