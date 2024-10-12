/**
 * https://juejin.cn/post/7310412236648202249
 */

import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
    // 配置用于控制是否自动清空输出目录
    clean: true,
    // 生成xx.d.ts声明文件
    declaration: true,
    // 配置用于指定构建过程中的入口文件或入口模块
    entries: ['src/index', './src/postcss.config'],
    // 配置用于指定哪些模块或库应该被视为外部依赖，不会被包含在最终的构建产物中。这个配置允许你明确地告诉构建工具哪些模块或库是外部的，需要在运行时从外部引入，而不是被打包进最终的构建结果中。
    externals: ['@dag/node-utils'],
    rollup: {
        // 如果启用，unbuild除了会生成ESM构建之外，还会生成CommonJS构建。
        emitCJS: true
    }
})
