import type { Linter } from 'eslint'

import { interopDefault } from '../util'

export async function typescript(): Promise<Linter.Config[]> {
    const [pluginTs, parserTs] = await Promise.all([
        interopDefault(import('@typescript-eslint/eslint-plugin')),
        // @ts-expect-error - no types
        interopDefault(import('@typescript-eslint/parser'))
    ])

    return [
        {
            files: ['**/*.?([cm])[jt]s?(x)'],
            languageOptions: {
                parser: parserTs,
                parserOptions: {
                    createDefaultProgram: false,
                    ecmaFeatures: {
                        jsx: true
                    },
                    ecmaVersion: 'latest',
                    extraFileExtensions: ['.vue'],
                    jsxPragma: 'React',
                    project: './tsconfig.*?.json',
                    sourceType: 'module'
                }
            },
            plugins: {
                '@typescript-eslint': pluginTs
            },
            rules: {
                ...pluginTs.configs['eslint-recommended'].overrides?.[0].rules,
                ...pluginTs.configs.strict.rules,
                // 不允许 @ts-<directive> 注释或要求在指令后添加说明
                // https://typescript-eslint.io/rules/ban-ts-comment/
                '@typescript-eslint/ban-ts-comment': [
                    'error',
                    {
                        'ts-check': false,
                        // 特定指令的 'allow-with-description' 值意味着如果此规则找到指令后面没有 description 的指令（在同一行上），则此规则将报告
                        'ts-expect-error': 'allow-with-description',
                        'ts-ignore': 'allow-with-description',
                        'ts-nocheck': 'allow-with-description'
                    }
                ],
                // 一致的类型定义 interface 或 type 选其一
                '@typescript-eslint/consistent-type-definitions': 'off',
                // 显式函数返回类型
                '@typescript-eslint/explicit-function-return-type': 'off',
                // 要求在导出的函数和类的公共类方法上显式 return 和 argument 类型
                '@typescript-eslint/explicit-module-boundary-types': 'off',
                // 不允许空函数
                '@typescript-eslint/no-empty-function': [
                    'error',
                    {
                        // https://eslint.org/docs/latest/rules/no-empty-function#options
                        allow: ['arrowFunctions', 'functions', 'methods']
                    }
                ],
                // 不允许 any 类型
                '@typescript-eslint/no-explicit-any': 'off',
                // 禁止 TypeScript 命名空间
                '@typescript-eslint/no-namespace': 'off',
                // 禁止使用 ! 运算符进行非 null 断言
                '@typescript-eslint/no-non-null-assertion': 'error',
                // 不允许未使用的表达式
                '@typescript-eslint/no-unused-expressions': 'off',
                // 不允许未使用的变量
                '@typescript-eslint/no-unused-vars': [
                    'error',
                    {
                        argsIgnorePattern: '^_',
                        varsIgnorePattern: '^_'
                    }
                ],
                '@typescript-eslint/no-use-before-define': 'off',
                '@typescript-eslint/no-var-requires': 'error',
                'unused-imports/no-unused-vars': 'off'
            }
        }
    ]
}
