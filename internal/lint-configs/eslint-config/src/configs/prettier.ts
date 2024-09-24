/**
 * 作为ESLint规则运行Prettier ，并将差异报告为单独的 ESLint 问题
 */
import type { Linter } from 'eslint'

import { interopDefault } from '../util'

export async function prettier(): Promise<Linter.Config[]> {
    const [prettierPlugin] = await Promise.all([
        interopDefault(import('eslint-plugin-prettier'))
    ] as const)

    return [
        {
            plugins: {
                prettier: prettierPlugin
            },
            rules: {
                'prettier/prettier': 'error'
            }
        }
    ]
}
