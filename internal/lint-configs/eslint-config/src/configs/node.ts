import type { Linter } from 'eslint'

import { interopDefault } from '../util'

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
