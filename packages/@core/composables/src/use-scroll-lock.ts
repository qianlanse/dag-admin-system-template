import { getScrollbarWidth, needsScrollbar } from '@dag-core/shared/utils'

import { useScrollLock as _useScrollLock, tryOnBeforeMount, tryOnMounted } from '@vueuse/core'

export const SCROLL_FIXED_CLASS = '_scroll__fixed_'

/** 锁定页面滚动 */
export function useScrollLock() {
    const isLocked = _useScrollLock(document.body)
    const scrollbarWidth = getScrollbarWidth()

    tryOnMounted(() => {
        if (!needsScrollbar()) {
            return
        }

        document.body.style.paddingRight = `${scrollbarWidth}px`

        const layoutFixedNodes = document.querySelectorAll<HTMLElement>(`.${SCROLL_FIXED_CLASS}`)
        const nodes = [...layoutFixedNodes]

        if (nodes.length > 0) {
            nodes.forEach((node) => {
                node.dataset.transition = node.style.transition
                node.style.transition = 'none'
                node.style.paddingRight = `${scrollbarWidth}px`
            })
        }

        isLocked.value = true
    })

    tryOnBeforeMount(() => {
        if (!needsScrollbar()) {
            return
        }

        isLocked.value = false

        const layoutFixedNodes = document.querySelectorAll<HTMLElement>(`.${SCROLL_FIXED_CLASS}`)
        const nodes = [...layoutFixedNodes]

        if (nodes.length > 0) {
            nodes.forEach((node) => {
                node.style.paddingRight = ''
                requestAnimationFrame(() => {
                    node.style.transition = node.dataset.transition || ''
                })
            })
        }

        document.body.style.paddingRight = ''
    })
}
