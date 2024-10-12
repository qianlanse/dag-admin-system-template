import { getColors } from 'theme-colors'

import { convertToHslCssVar, TinyColor } from './convert'

interface ColorItem {
    alias?: string
    color: string
    name: string
}

/**
 * 获取颜色变量值
 * @param {ColorItem[]} colorItems 传入值
 * @returns {Record<string, string>} 颜色变量
 */
export function generatorColorVariables(colorItems: ColorItem[]): Record<string, string> {
    const colorVariables: Record<string, string> = {}

    colorItems.forEach(({ alias, color, name }) => {
        if (color) {
            // 转换成十六进制 如#ff0000
            const hex = new TinyColor(color).toHexString()
            const colorsMap = getColors(hex)

            let mainColor = colorsMap['500']

            const colorKeys = Object.keys(colorsMap)

            colorKeys.forEach((key) => {
                const colorValue = colorsMap[key]

                if (colorValue) {
                    const hslColor = convertToHslCssVar(colorValue)
                    colorVariables[`--${name}-${key}`] = hslColor
                    if (alias) {
                        colorVariables[`--${alias}-${key}`] = hslColor
                    }

                    if (key === '500') {
                        mainColor = hslColor
                    }
                }
            })

            if (alias && mainColor) {
                colorVariables[`--${alias}`] = mainColor
            }
        }
    })

    return colorVariables
}
