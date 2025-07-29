function kebabToCamelCase(str: string): string {
    return str
        .split('-')
        .filter(Boolean)
        .map((word, index) => (index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)))
        .join('')
}

/**
 * 将字符串的首字母大写
 * @param string
 * @returns 字符串
 */
function capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1)
}

export { capitalizeFirstLetter, kebabToCamelCase }
