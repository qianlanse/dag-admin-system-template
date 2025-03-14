import type { Linter } from 'eslint'

import { interopDefault } from '../util'

/**
 * 针对注释的规则
 * @see https://mysticatea.github.io/eslint-plugin-eslint-comments/
 * @returns Promise<Linter.Config[]>
 */
export async function comments(): Promise<Linter.Config[]> {
    const [pluginComments] = await Promise.all([
        // @ts-expect-error - no types
        interopDefault(import('eslint-plugin-eslint-comments'))
    ] as const)

    return [
        {
            plugins: {
                'eslint-comments': pluginComments
            },
            rules: {
                // 不允许对多个 ESLint 禁用注释进行 ESLint 启用注释
                'eslint-comments/no-aggregating-enable': 'error',
                // 不允许重复的 ESLint 禁用评论
                'eslint-comments/no-duplicate-disable': 'error',
                // 不允许没有规则名称的 eslint-disable 注释
                'eslint-comments/no-unlimited-disable': 'error',
                // 不允许未使用的 eslint-enable 注释
                'eslint-comments/no-unused-enable': 'error'
            }
        }
    ]
}
