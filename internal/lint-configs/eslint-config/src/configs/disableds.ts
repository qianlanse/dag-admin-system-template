import type { Linter } from 'eslint'

export async function disableds(): Promise<Linter.Config[]> {
    return [
        {
            files: ['**/__tests__/**/*.?([cm])[jt]s?(x)'],
            name: 'disableds/test',
            rules: {
                // https://typescript-eslint.io/rules/ban-ts-comment
                // 不允许 @ts-<directive> 注释或要求在指令后添加说明
                '@typescript-eslint/ban-ts-comment': 'off',
                'no-console': 'off'
            }
        },
        {
            files: ['**/*.d.ts'],
            name: 'disableds/dts',
            rules: {
                // https://typescript-eslint.io/rules/triple-slash-reference
                // 不允许某些三斜杠指令，以支持 ES6 样式的导入声明
                '@typescript-eslint/triple-slash-reference': 'off'
            }
        },
        {
            files: ['**/*.js', '**/*.mjs', '**/*.cjs'],
            name: 'disableds/js',
            rules: {
                // https://typescript-eslint.io/rules/explicit-module-boundary-types
                // 要求在导出的函数和类的公共类方法上显式 return 和 argument 类型
                '@typescript-eslint/explicit-module-boundary-types': 'off'
            }
        }
    ]
}
