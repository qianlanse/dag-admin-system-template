import type { Component } from 'vue'

import { globalShareState } from '@dag/common-ui'

import { message } from '#/adapter/naive'

export type ComponentType = ''

async function initComponentAdapter() {
    const components: Partial<Record<ComponentType, Component>> = {}

    // 将组件注册到全局共享状态中
    globalShareState.setComponents(components)

    // 定义全局共享状态中的消息提示
    globalShareState.defineMessage({
        copyPreferencesSuccess: (title, content) => {
            message.success(content || title, {
                duration: 3000
            })
        }
    })
}

export { initComponentAdapter }
