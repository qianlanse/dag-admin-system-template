import type { ComputedRef } from 'vue'
import type { RouteLocationNormalized } from 'vue-router'

import { useRoute, useRouter } from 'vue-router'

import { useTabbarStore } from '@dag/stores'

export function useTabs() {
    const route = useRoute()
    const router = useRouter()
    const tabbarStore = useTabbarStore()

    /** 关闭左侧标签页 */
    async function closeLeftTabs(tab?: RouteLocationNormalized) {
        await tabbarStore.closeLeftTabs(tab || route)
    }

    /** 关闭所有标签页 */
    async function closeAllTabs() {
        await tabbarStore.closeAllTabs(router)
    }

    /** 关闭右侧标签页 */
    async function closeRightTabs(tab?: RouteLocationNormalized) {
        await tabbarStore.closeRightTabs(tab || route)
    }

    /** 关闭其它标签页 */
    async function closeOtherTabs(tab?: RouteLocationNormalized) {
        await tabbarStore.closeOtherTabs(tab || route)
    }

    /** 关闭指定标签页 */
    async function closeCurrentTab(tab?: RouteLocationNormalized) {
        await tabbarStore.closeTab(tab || route, router)
    }

    /** 固定标签页 */
    async function pinTab(tab?: RouteLocationNormalized) {
        await tabbarStore.pinTab(tab || route)
    }

    /** 取消固定标签页 */
    async function unpinTab(tab?: RouteLocationNormalized) {
        await tabbarStore.unpinTab(tab || route)
    }

    /** 切换固定标签页 */
    async function toggleTabPin(tab?: RouteLocationNormalized) {
        await tabbarStore.toggleTabPin(tab || route)
    }

    /** 刷新标签页 */
    async function refreshTab(name?: string) {
        await tabbarStore.refresh(name || router)
    }

    /** 新窗口打开标签页 */
    async function openTabInNewWindow(tab?: RouteLocationNormalized) {
        await tabbarStore.openTabInNewWindow(tab || route)
    }

    /** 通过key关闭标签页 */
    async function closeTabByKey(key: string) {
        await tabbarStore.closeTabByKey(key, router)
    }

    /**
     * 设置当前标签页的标题
     * @description 支持设置静态标题字符串或动态计算标题
     * @description 动态标题会在每次渲染时重新计算,适用于多语言或状态相关的标题
     */
    async function setTabTitle(title: ComputedRef<string> | string) {
        tabbarStore.setUpdateTime()
        await tabbarStore.setTabTitle(route, title)
    }

    /** 重置标签页标题 */
    async function resetTabTitle() {
        tabbarStore.setUpdateTime()
        await tabbarStore.resetTabTitle(route)
    }

    /** 获取操作是否禁用 */
    function getTabDisableState(tab: RouteLocationNormalized = route) {
        const tabs = tabbarStore.getTabs
        const affixTabs = tabbarStore.affixTabs
        const index = tabs.findIndex((item) => item.path === tab.path)

        const disabled = tabs.length <= 1
        const { meta } = tab
        const affixTab = meta?.affixTab ?? false
        const isCurrentTab = route.path === tab.path

        const disabledCloseLeft = index === 0 || index - affixTabs.length <= 0 || !isCurrentTab
        const disabledCloseRight = !isCurrentTab || index === tabs.length - 1

        const disabledCloseOther = disabled || !isCurrentTab || tabs.length - affixTabs.length <= 1

        return {
            disabledCloseAll: disabled,
            disabledCloseCurrent: !!affixTab || disabled,
            disabledCloseLeft,
            disabledCloseRight,
            disabledCloseOther,
            disabledRefresh: !isCurrentTab
        }
    }

    return {
        closeLeftTabs,
        closeRightTabs,
        closeOtherTabs,
        closeCurrentTab,
        pinTab,
        unpinTab,
        toggleTabPin,
        refreshTab,
        openTabInNewWindow,
        closeTabByKey,
        setTabTitle,
        resetTabTitle,
        getTabDisableState,
        closeAllTabs
    }
}
