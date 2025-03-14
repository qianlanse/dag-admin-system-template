import type { Linter } from 'eslint'

import { interopDefault } from '../util'

/**
 * 针对vue的规则验证
 */
export async function vue(): Promise<Linter.Config[]> {
    const [pluginVue, parserVue, parserTs] = await Promise.all([
        // @ts-expect-error - no types
        interopDefault(import('eslint-plugin-vue')),
        interopDefault(import('vue-eslint-parser')),
        // @ts-expect-error - no types
        interopDefault(import('@typescript-eslint/parser'))
    ])

    return [
        {
            files: ['**/*.vue'],
            languageOptions: {
                parser: parserVue,
                parserOptions: {
                    ecmaFeatures: {
                        jsx: true
                    },
                    extraFileExtensions: ['.vue'],
                    parser: parserTs,
                    sourceType: 'module'
                }
            },
            plugins: {
                vue: pluginVue
            },
            processor: pluginVue.processors['.vue'],
            rules: {
                ...pluginVue.configs.base.rules,
                // vue3基础
                ...pluginVue.configs['vue3-essential'].rules,
                // vue3强烈推荐
                ...pluginVue.configs['vue3-strongly-recommended'].rules,
                // vue3推荐
                ...pluginVue.configs['vue3-recommended'].rules,

                // 在模板中的自定义组件上强制实施属性命名样式
                'vue/attribute-hyphenation': [
                    'error',
                    'always',
                    {
                        ignore: []
                    }
                ],
                // 强制属性顺序
                'vue/attributes-order': 'off',
                // 强制组件顶级元素的顺序
                'vue/block-order': [
                    'error',
                    {
                        order: ['script', 'template', 'style']
                    }
                ],
                // 对模板中的组件命名样式强制执行特定大小写
                'vue/component-name-in-template-casing': ['error', 'PascalCase'],
                // 在 Components Options 中强制执行 Component Name 的大小写
                'vue/component-options-name-casing': ['error', 'PascalCase'],
                // 对自定义事件名称强制实施特定大小写
                'vue/custom-event-name-casing': ['error', 'camelCase'],
                'vue/define-macros-order': [
                    'error',
                    {
                        order: [
                            'defineOptions',
                            'defineProps',
                            'defineEmits',
                            'defineSlots',
                            'defineExpose'
                        ]
                    }
                ],
                // 在 <template> 中的点前后强制换行符一致
                'vue/dot-location': ['error', 'property'],
                // 在 <template> 中尽可能强制使用点表示法
                'vue/dot-notation': ['error', { allowKeywords: true }],
                // 严格全等判断 === 或 !==
                'vue/eqeqeq': ['error', 'smart'],
                // 要求或禁止在标签的右括号前使用换行符
                'vue/html-closing-bracket-newline': 'error',
                'vue/html-indent': ['error', 4],
                // 使用双引号
                'vue/html-quotes': ['error', 'double'],
                // 强制使用自闭合样式
                'vue/html-self-closing': [
                    'error',
                    {
                        html: {
                            component: 'always',
                            normal: 'never',
                            void: 'always'
                        },
                        math: 'always',
                        svg: 'always'
                    }
                ],
                // 强制每行的最大属性数
                'vue/max-attributes-per-line': 'off',
                // 要求组件名称始终为多字
                'vue/multi-word-component-names': 'off',
                // 要求在多行元素的内容之前和之后使用换行符
                'vue/multiline-html-element-content-newline': 'error',
                // 不允许在 <template> 中使用空解构模式
                // https://eslint.org/docs/latest/rules/no-empty-pattern
                'vue/no-empty-pattern': 'error',
                // 不允许在 <template> 中使用不必要的括号
                'vue/no-extra-parens': ['error', 'functions'],
                // 不允许在 .vue 文件中出现不规则的空格
                'vue/no-irregular-whitespace': 'error',
                // 不允许在 <template> 中丢失精度的文本数字
                'vue/no-loss-of-precision': 'error',
                // 禁止在组件定义中使用保留名称
                'vue/no-reserved-component-names': 'error',
                // 不允许在 <template> 中指定语法
                'vue/no-restricted-syntax': [
                    'error',
                    'DebuggerStatement',
                    'LabeledStatement',
                    'WithStatement'
                ],
                // 不允许在 v-bind 中使用特定参数
                'vue/no-restricted-v-bind': ['error', '/^v-/'],
                // 禁止在 <template> 中使用稀疏数组
                // https://eslint.org/docs/latest/rules/no-sparse-arrays
                'vue/no-sparse-arrays': 'error',
                // 不允许未使用的 ref
                'vue/no-unused-refs': 'error',
                // 不允许不必要的 v-bind 指令
                'vue/no-useless-v-bind': 'error',
                // 需要或禁止对象文本的方法和属性速记语法
                'vue/object-shorthand': [
                    'error',
                    'always',
                    {
                        avoidQuotes: true,
                        ignoreConstructors: false
                    }
                ],
                'vue/one-component-per-file': 'error',
                'vue/prefer-import-from-vue': 'error',
                'vue/prefer-separate-static-class': 'error',
                'vue/prefer-template': 'error',
                'vue/prop-name-casing': ['error', 'camelCase'],
                'vue/require-default-prop': 'error',
                'vue/require-explicit-emits': 'error',
                // Require props 中的类型定义
                'vue/require-prop-types': 'error',
                // 防止将 <template> 中使用的 <script setup> 变量标记为未使用[已弃用]
                'vue/script-setup-uses-vars': 'error',
                // 要求在 singleline 元素的内容之前和之后使用换行符
                'vue/singleline-html-element-content-newline': 'off',
                // 要求在 <template> 中的中缀运算符周围留出间距
                'vue/space-infix-ops': 'error',
                // 在 <template> 中的一元运算符之前或之后强制保持一致的间距
                'vue/space-unary-ops': ['error', { nonwords: false, words: true }],
                // 在模板中的自定义组件上强制实施 v-on 事件命名样式
                'vue/v-on-event-hyphenation': [
                    'error',
                    'always',
                    {
                        autofix: true,
                        ignore: []
                    }
                ]
            }
        }
    ]
}
