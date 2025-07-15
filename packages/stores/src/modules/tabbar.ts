import type { Router } from 'vue-router'

import type { TabDefinition } from '@dag-core/typings'

import { startProgress, stopProgress } from '@dag-core/shared/utils'

import { defineStore } from 'pinia'

interface TabbarState {
    /** 当前打开的标签页列表缓存 */
    cachedTabs: Set<string>
    /** 拖拽结束的索引 */
    dargEndIndex: number
    /** 需要排除缓存的标签页 */
    excludeCachedTabs: Set<string>
    /** 标签右键菜单列表 */
    menuList: string[]
    /** 是否刷新 */
    renderRouteView?: boolean
    /** 当前打开的标签页列表 */
    tabs: TabDefinition[]
    /** 更新时间，用于一些更新场景，使用watch深度监听的话会损耗性能 */
    updateTime?: number
}

export const useTabbarStore = defineStore('core-tabbar', {
    actions: {
        /** 刷新标签页 */
        async refresh(router: Router | string) {
            if (typeof router === 'string') {
                return this.refreshByName(router)
            }

            const { currentRoute } = router
            const { name } = currentRoute.value

            this.excludeCachedTabs.add(name as string)
            this.renderRouteView = false
            startProgress()

            await new Promise((resolve) => setTimeout(resolve, 200))

            this.excludeCachedTabs.delete(name as string)
            this.renderRouteView = true
            stopProgress()
        },

        /** 根据路由名称刷新指定标签页 */
        async refreshByName(name: string) {
            this.excludeCachedTabs.add(name)
            await new Promise((resolve) => setTimeout(resolve, 200))
            this.excludeCachedTabs.delete(name)
        }
    },
    state: (): TabbarState => ({
        cachedTabs: new Set(),
        dargEndIndex: 0,
        excludeCachedTabs: new Set(),
        menuList: ['close'],
        renderRouteView: true,
        tabs: [],
        updateTime: Date.now()
    })
})
