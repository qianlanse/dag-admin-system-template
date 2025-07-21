export interface VisibleDomRect {
    bottom: number
    height: number
    left: number
    right: number
    top: number
    width: number
}

/**
 * 获取元素可见信息
 * @param element
 */
export function getElementVisibleRect(element?: HTMLElement | null | undefined): VisibleDomRect {
    if (!element) {
        return {
            bottom: 0,
            height: 0,
            left: 0,
            right: 0,
            top: 0,
            width: 0
        }
    }

    const rect = element.getBoundingClientRect()
    const viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight)

    const top = Math.max(rect.top, 0)
    const bottom = Math.min(rect.bottom, viewHeight)

    const viewWidth = Math.max(document.documentElement.clientWidth, window.innerWidth)

    const left = Math.max(rect.left, 0)
    const right = Math.min(rect.right, viewWidth)

    return {
        bottom,
        height: Math.max(0, bottom - top),
        left,
        right,
        top,
        width: Math.max(0, right - left)
    }
}

/** 获取滚动条宽度 */
export function getScrollbarWidth() {
    const scrollDiv = document.createElement('div')

    scrollDiv.style.visibility = 'hidden'
    scrollDiv.style.overflow = 'scroll'
    scrollDiv.style.position = 'absolute'
    scrollDiv.style.top = '-9999px'

    document.body.append(scrollDiv)

    const innerDiv = document.createElement('div')
    scrollDiv.append(innerDiv)

    const scrollbarWidth = scrollDiv.offsetWidth - innerDiv.offsetWidth

    scrollDiv.remove()

    return scrollbarWidth
}

/** 验证内容区域高度是否大于窗口高度 */
export function needsScrollbar() {
    const doc = document.documentElement
    const body = document.body

    const overflowY = window.getComputedStyle(body).overflowY

    if (overflowY === 'scroll' || overflowY === 'auto') {
        return doc.scrollHeight > window.innerHeight
    }

    return doc.scrollHeight > window.innerHeight
}
