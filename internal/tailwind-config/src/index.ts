import type { Config } from 'tailwindcss'

import path from 'node:path'

import { getPackagesSync } from '@dag/node-utils'

import { addDynamicIconSelectors } from '@iconify/tailwind'
import typographyPlugin from '@tailwindcss/typography'
import animate from 'tailwindcss-animate'

import { enterAnimationPlugin } from './plugins/entry'

const { packages } = getPackagesSync()

const tailwindPackages: string[] = []

packages.forEach((pkg) => {
    tailwindPackages.push(pkg.dir)
})

/**
 * 创建调色板
 * @param name string
 * @returns object
 */
function createColorsPalette(name: string) {
    return {
        50: `hsl(var(--${name}-50))`,
        100: `hsl(var(--${name}-100))`,
        200: `hsl(var(--${name}-200))`,
        300: `hsl(var(--${name}-300))`,
        400: `hsl(var(--${name}-400))`,
        500: `hsl(var(--${name}-500))`,
        600: `hsl(var(--${name}-600))`,
        700: `hsl(var(--${name}-700))`,
        // 激活状态下的颜色，适用于按钮按下时的背景色或边框色。
        active: `hsl(var(--${name}-700))`,
        // 浅色背景，适用于输入框或表单区域的背景
        'background-light': `hsl(var(--${name}-200))`,
        // 适用于略浅的背景色，通常用于次要背景或略浅的区域
        'background-lighter': `hsl(var(--${name}-100))`,
        // 最浅的背景色，适用于非常轻微的阴影或卡片的背景
        'background-lightest': `hsl(var(--${name}-60))`,
        // 普通边框色，适用于按钮或卡片的边框
        border: `hsl(var(--${name}-400))`,
        // 浅色边框，适用于输入框或卡片的边框
        'border-light': `hsl(var(--${name}-300))`,
        // 前置色
        foreground: `hsl(var(--${name}-foreground))`,
        // 鼠标悬浮状态，适用于按钮悬停时的背景和边框色
        hover: `hsl(var(--${name}-600))`,
        // 主色文本
        text: `hsl(var(--${name}-500))`,
        // 主色文本激活状态
        'text-active': `hsl(var(--${name}-700))`,
        // 主色文本悬浮状态
        'text-hover': `hsl(var(--${name}-600))`
    }
}

const shadcnUiColors = {
    accent: {
        DEFAULT: 'hsl(var(--accent))',
        foreground: 'hsl(var(--accent-foreground))',
        hover: 'hsl(var(--accent-hover))',
        lighter: 'has(val(--accent-lighter))'
    },
    background: {
        deep: 'hsl(var(--background-deep))',
        DEFAULT: 'hsl(var(--background))'
    },
    border: {
        DEFAULT: 'hsl(var(--border))'
    },
    card: {
        DEFAULT: 'hsl(var(--card))',
        foreground: 'hsl(var(--card-foreground))'
    },
    destructive: {
        ...createColorsPalette('destructive'),
        DEFAULT: 'hsl(var(--destructive))'
    },
    foreground: {
        DEFAULT: 'hsl(var(--foreground))'
    },
    input: {
        background: 'hsl(var(--input))',
        DEFAULT: 'hsl(var(--input-background))'
    },
    muted: {
        DEFAULT: 'hsl(var(--muted))',
        foreground: 'hsl(var(--muted-foreground))'
    },
    popover: {
        DEFAULT: 'hsl(var(--popover))',
        foreground: 'hsl(var(--popover-foreground))'
    },
    primary: {
        ...createColorsPalette('primary'),
        DEFAULT: 'hsl(var(--primary))'
    },
    ring: 'hsl(var(--ring))',
    secondary: {
        DEFAULT: 'hsl(var(--secondary))',
        desc: 'hsl(var(--secondary-desc))',
        foreground: 'hsl(var(--secondary-foreground))'
    }
}

const customColors = {
    green: {
        ...createColorsPalette('green'),
        foreground: 'hsl(var(--success-foreground))'
    },
    header: {
        DEFAULT: 'hsl(var(--header))'
    },
    heavy: {
        DEFAULT: 'hsl(var(--heavy))',
        foreground: 'hsl(var(--heavy-foreground)'
    },
    main: {
        DEFAULT: 'hsl(var(--main))'
    },
    overlay: {
        content: 'hsl(var(--overlay-content))',
        DEFAULT: 'hsl(var(--overlay))'
    },
    red: {
        ...createColorsPalette('red'),
        foreground: 'hsl(var(--destructive-foreground))'
    },
    sidebar: {
        deep: 'hsl(var(--sidebar-deep))',
        DEFAULT: 'hsl(var(--sidebar))'
    },
    success: {
        ...createColorsPalette('success'),
        DEFAULT: 'hsl(var(--success))'
    },
    warning: {
        ...createColorsPalette('warning'),
        DEFAULT: 'hsl(var(--warning))'
    },
    yellow: {
        ...createColorsPalette('yellow'),
        DEFAULT: 'hsl(var(--warning-foreground)'
    }
}

export default {
    content: [
        './index.html',
        ...tailwindPackages.map((item) =>
            path.join(item, 'src/**/*.{vue,js,ts,jsx,tsx,svelte,astro,html}')
        )
    ],
    darkMode: 'selector',
    plugins: [animate, typographyPlugin, addDynamicIconSelectors(), enterAnimationPlugin()],
    prefix: '',
    safelist: ['dark'],
    theme: {
        container: {
            center: true,
            padding: '2rem',
            screens: {
                '2xl': '1400px'
            }
        },
        extend: {
            animation: {
                'accordion-down': 'accordion-down 0.2s ease-out',
                'accordion-up': 'accordion-up 0.2s ease-out',
                'collapsible-down': 'collapsible-down 0.2s ease-in-out',
                'collapsible-up': 'collapsible-up 0.2s ease-in-out',
                float: 'float 5s linear 0ms infinite'
            },
            animationDuration: {
                '2000': '2000ms',
                '3000': '3000ms'
            },
            borderColor: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)',
                xl: 'calc(var(--radius) + 2px)'
            },
            boxShadow: {
                float: `0 6px 16px 0 rgb(0 0 0 / 8%), 0 3px 6px -4px rgb(0 0 0 / 12%), 0 9px 28px 8px rgb(0 0 0 / 5%)`
            },
            colors: {
                ...customColors,
                ...shadcnUiColors
            },
            fontFamily: {
                sans: ['var(--font-family)']
            },
            keyframes: {
                'accordion-down': {
                    from: { height: '0' },
                    to: { height: 'var(--radix-accordion-content-height)' }
                },
                'accordion-up': {
                    from: { height: 'var(--radix-accordion-content-height)' },
                    to: { height: '0' }
                },
                'collapsible-down': {
                    from: { height: '0' },
                    to: { height: 'var(--radix-collapsible-content-height)' }
                },
                'collapsible-up': {
                    from: { height: 'var(--radix-collapsible-content-height)' },
                    to: { height: '0' }
                },
                float: {
                    '0%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                    '100%': { transform: 'translateY(0)' }
                }
            },
            zIndex: {
                '100': '100',
                '1000': '1000'
            }
        }
    }
} as Config
