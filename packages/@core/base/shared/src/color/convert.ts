import { TinyColor } from '@ctrl/tinycolor'

/**
 * 将颜色转换为HSL CSS变量
 * @param {string} color 输入的颜色
 * @returns {string} 可以作为CSS变量使用的HSL格式的颜色字符串
 */
export function convertToHslCssVar(color: string): string {
    const { a, h, l, s } = new TinyColor(color).toHsl()
    const hsl = `${Math.round(h)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`
    return a < 1 ? `${hsl} / ${a}` : hsl
}

export { TinyColor }
