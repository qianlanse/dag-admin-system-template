/**
 * ESLint 插件，用于对各种数据进行排序，例如对象、导入、类型、枚举、JSX props 等
 */

import type { Linter } from 'eslint'

import perfectionistPlugin from 'eslint-plugin-perfectionist'

export async function perfectionist(): Promise<Linter.Config[]> {
    return [
        perfectionistPlugin.configs['recommended-natural'],
        {
            rules: {
                // 强制导出排序
                // https://perfectionist.dev/rules/sort-exports
                'perfectionist/sort-exports': [
                    'error',
                    {
                        order: 'asc',
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
                                dag: 'dag',
                                vue: 'vue'
                            },
                            value: {
                                dag: ['@dag*', '@dag/**/**', '@dag-core/**/**'],
                                vue: ['vue', 'vue-*', '@vue*']
                            }
                        },
                        groups: [
                            ['external-type', 'builtin-type', 'type'],
                            ['parent-type', 'sibling-type', 'index-type'],
                            ['internal-type'],
                            'builtin',
                            'vue',
                            'dag',
                            'external',
                            'internal',
                            ['parent', 'sibling', 'index'],
                            'side-effect',
                            'side-effect-style',
                            'style',
                            'object',
                            'unknown'
                        ],
                        internalPattern: ['#*', '#*/**'],
                        newlinesBetween: 'always',
                        order: 'asc',
                        type: 'natural'
                    }
                ],
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
                        ignorePattern: ['children'],
                        order: 'asc',
                        partitionByComment: 'Part:**',
                        type: 'natural'
                    }
                ],
                'perfectionist/sort-vue-attributes': [
                    'error',
                    {
                        customGroups: {
                            /* eslint-disable perfectionist/sort-objects */
                            DEFINITION: '*(is|:is|v-is)',
                            LIST_RENDERING: 'v-for',
                            CONDITIONALS: 'v-*(else-if|if|else|show|cloak)',
                            RENDER_MODIFIERS: 'v-*(pre|once)',
                            GLOBAL: '*(:id|id)',
                            UNIQUE: '*(ref|key|:ref|:key)',
                            SLOT: '*(v-slot|slot)',
                            TWO_WAY_BINDING: '*(v-model|v-model:*)',
                            // OTHER_DIRECTIVES e.g. 'v-custom-directive'
                            EVENTS: '*(v-on|@*)',
                            CONTENT: 'v-*(html|text)'
                            /* eslint-enable perfectionist/sort-objects */
                        },
                        groups: [
                            'DEFINITION',
                            'LIST_RENDERING',
                            'CONDITIONALS',
                            'RENDER_MODIFIERS',
                            'GLOBAL',
                            'UNIQUE',
                            'SLOT',
                            'TWO_WAY_BINDING',
                            'unknown',
                            'EVENTS',
                            'CONTENT'
                        ],
                        type: 'natural'
                    }
                ]
            }
        }
    ]
}
