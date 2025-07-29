import { TinyColor } from '@ctrl/tinycolor'

/**
 * 将颜色转换为HSL CSS变量
 * @param {string} color 输入的颜色
 * @returns {string} 可以作为CSS变量使用的HSL格式的颜色字符串
 */
function convertToHslCssVar(color: string): string {
    const { a, h, l, s } = new TinyColor(color).toHsl()
    const hsl = `${Math.round(h)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`
    return a < 1 ? `${hsl} / ${a}` : hsl
}

/**
 * 将颜色转换为HSL格式
 * @info HSL是一种颜色模型，包括色相(Hue)、饱和度(Saturation)和亮度(Lightness)三个部分
 * @param color 输入的颜色
 * @returns {string} HSL格式的颜色字符串
 */
function convertToHsl(color: string): string {
    const { a, h, l, s } = new TinyColor(color).toHsl()
    const hsl = `hsl(${Math.round(h)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%)`
    return a < 1 ? `${hsl} ${a}` : hsl
}

export { convertToHsl, convertToHslCssVar, TinyColor }
