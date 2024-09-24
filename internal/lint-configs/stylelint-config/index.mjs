/**
 * @see https://stylelint.io/user-guide/configure/
 * @type {import("stylelint").Config}
 */

export default {
    extends: [
        // Stylelint 的标准可共享配置
        // 它扩展了 stylelint-config-recommended 并打开了其他规则来强制执行 CSS 规范中的现代约定
        'stylelint-config-standard',
        // 一个 Stylelint 配置，它以 Recess 和 Bootstrap 的方式对 CSS 属性进行排序
        'stylelint-config-recess-order'
    ],
    ignoreFiles: ['**/*.js', '**/*.jsx', '**/*.tsx', '**/*.ts', '**/*.json', '**/*.md'],
    overrides: [
        {
            customSyntax: 'postcss-html',
            files: ['*.(html|vue)', '**/*.(html|vue)'],
            rules: {
                // 禁止未知的伪类选择器(https://stylelint.docschina.org/user-guide/rules/selector-pseudo-class-no-unknown/)
                'selector-pseudo-class-no-unknown': [
                    true,
                    {
                        ignorePseudoClasses: ['global', 'deep']
                    }
                ],
                // 禁止未知的伪元素选择器(https://stylelint.docschina.org/user-guide/rules/selector-pseudo-element-no-unknown/)
                'selector-pseudo-element-no-unknown': [
                    true,
                    {
                        ignorePseudoElements: ['v-deep', 'v-global', 'v-slotted']
                    }
                ]
            }
        },
        {
            customSyntax: 'postcss-scss',
            extends: ['stylelint-config-recommended-scss', 'stylelint-config-recommended-vue/scss'],
            files: ['*.scss', '**/*.scss']
        }
    ],
    plugins: [
        // 指定样式顺序
        // https://www.npmjs.com/package/stylelint-order
        'stylelint-order',
        // Stylelint 删除了 76 条强制执行风格约定的规则。该项目返回这些规则以使样式与您的代码指南保持一致。此外，未来可能会增加新的规则。
        // https://www.npmjs.com/package/@stylistic/stylelint-plugin
        '@stylistic/stylelint-plugin',
        // 作为Stylelint规则运行Prettier，并将差异报告为单独的 Stylelint 问题
        // https://www.npmjs.com/package/stylelint-prettier
        'stylelint-prettier',
        // Stylelint的 SCSS 特定 linting 规则的集合
        // https://www.npmjs.com/package/stylelint-scss
        'stylelint-scss'
    ],
    rules: {
        // 禁止未知的@规则
        'at-rule-no-unknown': [
            true,
            {
                ignoreAtRules: [
                    'extends',
                    'ignores',
                    'include',
                    'mixin',
                    'if',
                    'else',
                    'media',
                    'for',
                    'at-root',
                    'tailwind',
                    'apply',
                    'veriants',
                    'responsive',
                    'screen',
                    'function',
                    'each',
                    'use',
                    'forward',
                    'return'
                ]
            }
        ],
        // 禁止在字体族名称列表中缺少通用字体族关键字
        'font-family-no-missing-generic-family-keyword': null,
        // 禁止未知函数
        'function-no-unknown': null,
        // 指定 @import 规则的字符串或 URL 表示法
        'import-notation': null,
        // 指定媒体特征范围的上下文或前缀表示法
        'media-feature-range-notation': null,
        // 禁止无效的命名网格区域
        'named-grid-areas-no-invalid': null,
        // 禁止将特异性较低的选择器覆盖特异性较高的选择器
        'no-descending-specificity': null,
        // 不允许空源(https://stylelint.io/user-guide/rules/no-empty-source/)
        'no-empty-source': null,
        // https://github.com/hudochenkov/stylelint-order/blob/HEAD/rules/order/README.md
        'order/order': [
            [
                // $变量
                'dollar-variables',
                // 自定义属性
                'custom-properties',
                // 嵌套的 at-rules
                'at-rules',
                // CSS 声明
                'declarations',
                {
                    name: 'supports',
                    type: 'at-rule'
                },
                {
                    name: 'media',
                    type: 'at-rule'
                },
                {
                    name: 'include',
                    type: 'at-rule'
                },
                'rules'
            ],
            // 严重性
            { severity: 'error' }
        ],
        'prettier/prettier': true,
        // 在规则之前要求或不允许空行(https://stylelint.io/user-guide/rules/rule-empty-line-before/)
        'rule-empty-line-before': [
            'always',
            {
                ignore: ['after-comment', 'first-nested']
            }
        ],
        'scss/at-rule-no-unknown': [
            true,
            {
                ignoreAtRules: [
                    'extends',
                    'ignores',
                    'include',
                    'mixin',
                    'if',
                    'else',
                    'media',
                    'for',
                    'at-root',
                    'tailwind',
                    'apply',
                    'variants',
                    'responsive',
                    'screen',
                    'function',
                    'each',
                    'use',
                    'forward',
                    'return'
                ]
            }
        ],
        // 禁止在 Sass 运算符之后换
        'scss/operator-no-newline-after': null,
        // 指定类选择器的模式
        'selector-class-pattern':
            '^(?:(?:o|c|u|t|s|is|has|_|js|qa)-)?[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*(?:__[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*)?(?:--[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*)?(?:[.+])?$',
        // 为 :not() 伪类选择器指定简单或复杂的表示法(https://stylelint.io/user-guide/rules/selector-not-notation/)
        'selector-not-notation': null
    }
}
