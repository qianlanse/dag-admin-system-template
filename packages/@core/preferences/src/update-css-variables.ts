import type { Preferences } from './types'

import { generatorColorVariables } from '@dag-core/shared/color'
import { updateCSSVariables as executeUpdateCSSVariables } from '@dag-core/shared/utils'

import { BUILT_IN_THEME_PRESETS } from './constants'

/**
 * 更新主要的CSS变量
 * @param preferences 当前偏好设置对象，它的颜色值将被转换成HSL格式并设置为CSS变量
 */
function updateMainColorVariables(preferences: Preferences) {
    if (!preferences.theme) {
        return
    }

    const { colorDestructive, colorPrimary, colorSuccess, colorWarning } = preferences.theme

    const colorVariables = generatorColorVariables([
        { color: colorPrimary, name: 'primary' },
        { alias: 'warning', color: colorWarning, name: 'warning' },
        { alias: 'success', color: colorSuccess, name: 'green' },
        { alias: 'destructive', color: colorDestructive, name: 'red' }
    ])

    // console.log('colorVariables:', colorVariables)

    const colorMappings = {
        '--green-500': '--success',
        '--primary-500': '--primary',
        '--red-500': '--red',
        '--yellow-500': '--yellow'
    }

    // 设置自定义变量值
    Object.entries(colorMappings).forEach(([sourceVal, targetVal]) => {
        const colorValue = colorVariables[sourceVal]
        if (colorValue) {
            document.documentElement.style.setProperty(targetVal, colorValue)
        }
    })

    // 生成CSS变量
    executeUpdateCSSVariables(colorVariables)
}

/**
 * 验证是否为暗黑色
 * @param theme 主题色
 * @returns boolean
 */
export function isDarkTheme(theme: string) {
    let dark = theme === 'dark'
    if (theme === 'auto') {
        dark = window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    return dark
}

/**
 * 更新主题的CSS变量以及其他CSS变量
 * @param preferences 当前偏好设置对象，它的主题值将被用来设置文档的主题
 */
export function updateCSSVariables(preferences: Preferences) {
    const root = document.documentElement
    if (!root) {
        return
    }

    const theme = preferences?.theme ?? {}
    const { builtinType, colorPrimary, mode, radius } = theme

    if (Reflect.has(theme, 'mode')) {
        const dark = isDarkTheme(mode)
        root.classList.toggle('dark', dark)
    }

    if (Reflect.has(theme, 'builtinType')) {
        const rootTheme = root.dataset.theme
        if (rootTheme !== builtinType) {
            root.dataset.theme = builtinType
        }
    }

    const currentBuiltType = [...BUILT_IN_THEME_PRESETS].find((item) => item.type === builtinType)

    let builtinTypeColorPrimary: string | undefined = ''

    if (currentBuiltType) {
        const isDark = isDarkTheme(preferences.theme.mode)
        // 设置不同主题的主题颜色
        const color = isDark
            ? currentBuiltType.darkPrimaryColor || currentBuiltType.primaryColor
            : currentBuiltType.primaryColor
        builtinTypeColorPrimary = color || currentBuiltType.color
    }

    if (
        builtinTypeColorPrimary ||
        Reflect.has(theme, 'colorPrimary') ||
        Reflect.has(theme, 'colorDestructive') ||
        Reflect.has(theme, 'colorSuccess') ||
        Reflect.has(theme, 'colorWarning')
    ) {
        preferences.theme.colorPrimary = builtinTypeColorPrimary || colorPrimary
        updateMainColorVariables(preferences)
    }

    // 设置根圆角值
    if (Reflect.has(theme, 'radius')) {
        document.documentElement.style.setProperty('--radius', `${radius}rem`)
    }
}
