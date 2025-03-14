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
    rollup: {
        // 如果启用，unbuild除了会生成ESM构建之外，还会生成CommonJS构建。
        emitCJS: true
    }
})
