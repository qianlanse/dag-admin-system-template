import type { Linter } from 'eslint'

import * as pluginImport from 'eslint-plugin-import-x'

/**
 * 导入(import)顺序规则
 * @see https://www.npmjs.com/package/eslint-plugin-import-x
 * @returns Promise<Linter.Config[]>
 */
export async function importPluginConfig(): Promise<Linter.Config[]> {
    return [
        {
            plugins: {
                // @ts-expect-error - This is a dynamic import
                import: pluginImport
            },
            rules: {
                // 强制或禁止对命名导入使用内联类型标记
                'import/consistent-type-specifier-style': ['error', 'prefer-top-level'],
                // 确保所有导入出现在其他语句之前
                'import/first': 'error',
                // 在 import 语句后强制换行
                'import/newline-after-import': 'error',
                // 禁止在多个地方重复导入同一模块
                'import/no-duplicates': 'error',
                // 禁止通过 var 或 let 使用可变导出
                'import/no-mutable-exports': 'error',
                // 禁止命名默认导出
                'import/no-named-default': 'error',
                // 禁止模块导入自身
                'import/no-self-import': 'error',
                // 确保导入指向可以解析的文件/模块
                'import/no-unresolved': 'off',
                // 禁止导入 webpack 加载器语法
                'import/no-webpack-loader-syntax': 'error'
            }
        }
    ]
}
