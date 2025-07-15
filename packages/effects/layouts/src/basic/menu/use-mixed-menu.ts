import type { MenuRecordRaw } from '@dag/types'

import { computed, onBeforeMount, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import { preferences, usePreferences } from '@dag/preferences'
import { useAccessStore } from '@dag/stores'
import { findRootMenuByPath } from '@dag/utils'

import { useNavigation } from './use-navigation'

export function useMixedMenu() {
    const route = useRoute()

    const accessStore = useAccessStore()
    const { isMixedNav, isHeaderMixedNav } = usePreferences()
    const { navigation, willOpenedByWindow } = useNavigation()

    const defaultSubMap = new Map<string, string>()

    const splitSideMenus = ref<MenuRecordRaw[]>([])
    const rootMenuPath = ref<string>('')
    const mixedRootMenuPath = ref<string>('')
    const mixExtraMenus = ref<MenuRecordRaw[]>([])

    const menus = computed(() => accessStore.accessMenus)
    const needSplit = computed(
        () => (preferences.navigation.split && isMixedNav.value) || isHeaderMixedNav.value
    )

    const sidebarVisible = computed(() => {
        const enableSidebar = preferences.sidebar.enable
        if (needSplit.value) {
            return enableSidebar && splitSideMenus.value.length > 0
        }
        return enableSidebar
    })

    /** 侧栏菜单列表 */
    const sidebarMenus = computed(() => {
        return needSplit.value ? splitSideMenus.value : menus.value
    })

    /** 侧边菜单激活路径 */
    const sidebarActive = computed(() => (route?.meta?.activePath as string) ?? route.path)

    /** 侧边菜单展开事件 */
    function handleMenuOpen(key: string, parentsPath: string[]) {
        if (parentsPath.length <= 1 && preferences.sidebar.autoActivateChild) {
            navigation(defaultSubMap.has(key) ? (defaultSubMap.get(key) as string) : key)
        }
    }

    /** 菜单点击事件处理 */
    function handleMenuSelect(key: string, mode?: string) {
        if (!needSplit.value || mode === 'vertical') {
            navigation(key)
            return
        }
        const rootMenu = menus.value.find((item) => item.path === key)
        const _splitSideMenus = rootMenu?.children ?? []

        if (!willOpenedByWindow(key)) {
            rootMenuPath.value = rootMenu?.path ?? ''
            splitSideMenus.value = _splitSideMenus
        }

        if (_splitSideMenus.length === 0) {
            navigation(key)
        } else if (rootMenu && preferences.sidebar.autoActivateChild) {
            navigation(
                defaultSubMap.has(rootMenu.path)
                    ? (defaultSubMap.get(rootMenu.path) as string)
                    : rootMenu.path
            )
        }
    }

    /** 计算侧边菜单 */
    function calcSideMenus(path: string = route.path) {
        let { rootMenu } = findRootMenuByPath(menus.value, path)
        if (!rootMenu) {
            rootMenu = menus.value.find((item) => item.path === path)
        }
        const result = findRootMenuByPath(rootMenu?.children || [], path, 1)
        mixedRootMenuPath.value = result.rootMenuPath ?? ''
        mixExtraMenus.value = result.rootMenu?.children ?? []
        rootMenuPath.value = rootMenu?.path ?? ''
        splitSideMenus.value = rootMenu?.children ?? []
    }

    watch(
        () => route.path,
        (path) => {
            const currentPath = (route?.meta?.activePath as string) ?? path
            calcSideMenus(currentPath)
            if (rootMenuPath.value) {
                defaultSubMap.set(rootMenuPath.value, currentPath)
            }
        },
        { immediate: true }
    )

    // 初始化计算侧边菜单
    onBeforeMount(() => {
        calcSideMenus(route.meta?.activePath || route.path)
    })

    return {
        sidebarMenus,
        sidebarActive,
        sidebarVisible,
        handleMenuOpen,
        handleMenuSelect,
        mixedRootMenuPath,
        mixExtraMenus
    }
}
