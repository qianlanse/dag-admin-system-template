/**
 * 创建并更新CSS变量的函数
 * @param variables 要更新的CSS变量与其新值的映射
 * @param id 样式唯一值
 */
export function updateCSSVariables(variables: Record<string, string>, id = '__dag-styles__') {
    // 获取或创建内联样式表元素
    const styleElement = document.querySelector(`#${id}`) || document.createElement('style')
    styleElement.id = id

    let cssText = ':root {'
    for (const key in variables) {
        if (Object.prototype.hasOwnProperty.call(variables, key)) {
            cssText += `${key}: ${variables[key]}; `
        }
    }
    cssText += '}'

    styleElement.textContent = cssText

    if (!document.querySelector(`#${id}`)) {
        setTimeout(() => {
            document.head.append(styleElement)
        })
    }
}
