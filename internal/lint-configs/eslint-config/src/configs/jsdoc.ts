import type { Linter } from 'eslint'

import { interopDefault } from '../util'

export async function jsdoc(): Promise<Linter.Config[]> {
    const [pluginJsdoc] = await Promise.all([
        interopDefault(import('eslint-plugin-jsdoc'))
    ] as const)

    return [
        {
            plugins: {
                jsdoc: pluginJsdoc
            },
            rules: {
                // 强制实施有效的 @access 标记
                'jsdoc/check-access': 'warn',
                // 检查重复@param名称，嵌套参数名称是否具有根，以及函数声明中的参数名称是否与 jsdoc 参数名称匹配
                'jsdoc/check-param-names': 'warn',
                // 检查重复@property名称，嵌套属性名称是否具有根
                'jsdoc/check-property-names': 'warn',
                // 被视为无效的报告类型
                'jsdoc/check-types': 'warn',
                // 检查预期为空的标记
                'jsdoc/empty-tags': 'warn',
                // 禁止在非构造函数上使用 @implements
                'jsdoc/implements-on-classes': 'warn',
                // 此规则报告对 @param 或 @default 的相关部分使用的默认值
                'jsdoc/no-defaults': 'warn',
                // 防止在行首使用多个星号
                'jsdoc/no-multi-asterisks': 'warn',
                // 要求所有 @param 标签都有名称
                'jsdoc/require-param-name': 'warn',
                // 要求所有 @typedef 和 @namespace 标签在类型为普通对象、Object 或 PlainObject 时都具有 @property 标签
                'jsdoc/require-property': 'warn',
                // 要求每个 @property 标签都有一个 description 值
                'jsdoc/require-property-description': 'warn',
                // 要求所有 @property 标签都有名称
                'jsdoc/require-property-name': 'warn',
                // 如果在 jsdoc 注释块中指定了 @returns 标记，则要求函数体中存在 return 语句
                'jsdoc/require-returns-check': 'warn',
                // 要求 @returns 标记具有 description 值
                'jsdoc/require-returns-description': 'warn',
                // 确保如果存在 @yields，则函数体中存在 yield（或带有值的 yield）（或者如果存在 @next，则存在具有返回值的 yield）
                'jsdoc/require-yields-check': 'warn'
            }
        }
    ]
}
