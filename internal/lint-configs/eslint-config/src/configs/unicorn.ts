/**
 * https://blog.csdn.net/gitblog_00830/article/details/141982098
 */

import type { Linter } from 'eslint'

import { interopDefault } from '../util'

export async function unicorn(): Promise<Linter.Config[]> {
    const [unicornPlugin] = await Promise.all([
        interopDefault(import('eslint-plugin-unicorn'))
    ] as const)

    return [
        {
            plugins: {
                unicorn: unicornPlugin
            },
            rules: {
                ...unicornPlugin.configs.recommended.rules,

                // 通过使正则表达式更短、一致、更安全来改进正则表达式
                'unicorn/better-regex': 'off',
                // 对 properties 使用解构变量
                'unicorn/consistent-destructuring': 'off',
                // 将函数定义移动到尽可能高的范围
                'unicorn/consistent-function-scoping': 'off',
                // 对文件名强制使用大小写样式
                'unicorn/filename-case': 'off',
                // 为每个模块强制实施特定的导入样式
                // https://github.com/sindresorhus/eslint-plugin-unicorn/blob/HEAD/docs/rules/import-style.md
                'unicorn/import-style': 'off',
                // for..of优于for..each
                'unicorn/no-array-for-each': 'off',
                // 不允许使用 null 文本
                'unicorn/no-null': 'off',
                // 不允许使用 undefined 文本
                'unicorn/no-useless-undefined': 'off',
                'unicorn/prefer-at': 'off',
                // 首选 .textContent 而不是 .innerText
                'unicorn/prefer-dom-node-text-content': 'off',
                // https://github.com/sindresorhus/eslint-plugin-unicorn/blob/HEAD/docs/rules/prefer-export-from.md
                'unicorn/prefer-export-from': ['error', { ignoreUsedVariables: true }],
                // 相比 window、self 和 global，优先使用 globalThis。
                'unicorn/prefer-global-this': 'off',
                // https://github.com/sindresorhus/eslint-plugin-unicorn/blob/HEAD/docs/rules/prefer-top-level-await.md
                'unicorn/prefer-top-level-await': 'off',
                // 防止缩写
                // https://github.com/sindresorhus/eslint-plugin-unicorn/blob/HEAD/docs/rules/prevent-abbreviations.md
                'unicorn/prevent-abbreviations': 'off'
            }
        },
        {
            files: ['scripts/**/*.?([cm])[jt]s?(x)', 'internal/**/*.?([cm])[jt]s?(x)'],
            rules: {
                // 禁止 process.exit()
                'unicorn/no-process-exit': 'off'
            }
        }
    ]
}
