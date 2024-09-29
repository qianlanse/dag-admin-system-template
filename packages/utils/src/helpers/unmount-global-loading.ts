/**
 * 移除并销毁loading
 */
export function unmountGlobalLoading() {
    const loadingElement = document.querySelector('#__app-loading__')

    if (loadingElement) {
        // 添加隐藏类，触发过渡效果
        loadingElement.classList.add('hidden')

        // 查找所有需要移除的注入loading元素
        const injectLoadingElements = document.querySelectorAll('[data-app-loading^="inject"]')

        loadingElement.addEventListener(
            'transitionend',
            () => {
                // 移除loading元素
                loadingElement.remove()
                // 移除所有注入的loading元素
                injectLoadingElements.forEach((el) => el.remove())
            },
            // 确保事件只触发一次
            { once: true }
        )
    }
}
