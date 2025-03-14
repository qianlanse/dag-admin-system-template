import type { Linter } from 'eslint'

import { interopDefault } from '../util'

/**
 * Node.js 的附加 ESLint 规则
 * @see https://github.com/eslint-community/eslint-plugin-n?tab=readme-ov-file
 */
export async function node(): Promise<Linter.Config[]> {
    const pluginNode = await interopDefault(import('eslint-plugin-n'))

    return [
        {
            plugins: {
                n: pluginNode
            },
            rules: {}
        }
    ]
}
