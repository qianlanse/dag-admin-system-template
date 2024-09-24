/**
 * ESLint 插件，用于查找 RegExp 错误和 RegExp 风格指南违规
 */

import type { Linter } from 'eslint'

import { interopDefault } from '../util'

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
