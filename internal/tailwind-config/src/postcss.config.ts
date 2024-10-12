import type { Config } from 'postcss-load-config'

import tailwindConfig from '.'

export default {
    plugins: {
        ...(process.env.NODE_ENV === 'production' ? { cssnano: {} } : {}),
        // 在大多数情况下，不需要指定配置，但它包含在内
        autoprefixer: {},
        // 修复 element-plus 和 ant-design-vue 的样式和tailwindcss冲突问题
        'postcss-antd-fixes': { prefixes: ['ant', 'el'] },
        'postcss-import': {},
        'postcss-preset-env': {},
        tailwindcss: {
            config: tailwindConfig
        },
        'tailwindcss/nesting': {}
    }
} as Config
