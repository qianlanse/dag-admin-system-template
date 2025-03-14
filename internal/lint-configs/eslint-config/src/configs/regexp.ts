import type { Linter } from 'eslint'

import { interopDefault } from '../util'

/**
 * 用于查找 RegExp 错误和 RegExp 样式指南违规的 ESLint 插件
 * @see https://ota-meshi.github.io/eslint-plugin-regexp/rules/
 */
export async function regexp(): Promise<Linter.Config[]> {
    const [regexpPlugin] = await Promise.all([
        interopDefault(import('eslint-plugin-regexp'))
    ] as const)

    return [
        {
            plugins: {
                regexp: regexpPlugin
            },
            rules: {
                ...regexpPlugin.configs.recommended.rules
            }
        }
    ]
}
