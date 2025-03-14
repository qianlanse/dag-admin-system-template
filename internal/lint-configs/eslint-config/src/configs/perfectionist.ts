import type { Linter } from 'eslint'

import { interopDefault } from '../util'

/**
 * ESLint 插件，用于对各种数据进行排序，例如对象、导入、类型、枚举、JSX props 等
 * @see https://perfectionist.dev/guide/getting-started
 */
export async function perfectionist(): Promise<Linter.Config[]> {
    const perfectionistPlugin = await interopDefault(
        // @ts-expect-error - no types
        import('eslint-plugin-perfectionist')
    )
    return [
        perfectionistPlugin.configs['recommended-natural'],
        {
            rules: {
                // 强制执行导出排序
                // https://perfectionist.dev/rules/sort-exports
                'perfectionist/sort-exports': [
                    'error',
                    {
                        // 按升序对项目进行排序（A到Z，1到9）
                        order: 'asc',
                        // 按自然顺序对项目进行排序（例如，“item2”<“item10”）
                        type: 'natural'
                    }
                ],
                // 强制导入排序
                // https://perfectionist.dev/rules/sort-imports
                'perfectionist/sort-imports': [
                    'error',
                    {
                        customGroups: {
                            type: {
                                'dag-core-type': ['^@dag-core/.+'],
                                'dag-type': ['^@dag/.+'],
                                'vue-type': ['^vue$', '^vue-.+', '^@vue/.+']
                            },
                            value: {
                                dag: ['^@dag/.+'],
                                'dag-core': ['^@dag-core/.+'],
                                vue: ['^vue$', '^vue-.+', '^@vue/.+']
                            }
                        },
                        environment: 'node',
                        groups: [
                            ['external-type', 'builtin-type', 'type'],
                            'vue-type',
                            'dag-type',
                            'dag-core-type',
                            ['parent-type', 'sibling-type', 'index-type'],
                            ['internal-type'],
                            'builtin',
                            'vue',
                            'dag',
                            'dag-core',
                            'external',
                            'internal',
                            ['parent', 'sibling', 'index'],
                            'side-effect',
                            'side-effect-style',
                            'style',
                            'object',
                            'unknown'
                        ],
                        internalPattern: ['^#/.+'],
                        newlinesBetween: 'always',
                        order: 'asc',
                        type: 'natural'
                    }
                ],
                // 强制对模块成员进行排序
                // https://perfectionist.dev/rules/sort-modules
                'perfectionist/sort-modules': 'off',
                // 强制导出命名排序
                // https://perfectionist.dev/rules/sort-named-exports
                'perfectionist/sort-named-exports': [
                    'error',
                    {
                        order: 'asc',
                        type: 'natural'
                    }
                ],
                // 强制对象排序
                // https://perfectionist.dev/rules/sort-objects
                'perfectionist/sort-objects': [
                    'error',
                    {
                        customGroups: {
                            items: 'items',
                            list: 'list',
                            children: 'children'
                        },
                        groups: ['unknown', 'items', 'list', 'children'],
                        order: 'asc',
                        type: 'natural'
                    }
                ]
            }
        }
    ]
}
