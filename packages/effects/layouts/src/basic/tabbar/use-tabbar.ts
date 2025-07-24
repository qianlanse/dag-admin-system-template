import type { RouteLocationNormalizedGeneric } from 'vue-router'

import type { TabDefinition } from '@dag/types'

import type { IContextMenuItem } from '@dag-core/tabs-ui'

import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useContentMaximize, useTabs } from '@dag/hooks'
import {
    ArrowLeftToLine,
    ArrowRightLeft,
    ArrowRightToLine,
    ExternalLink,
    FoldHorizontal,
    Fullscreen,
    Minimize2,
    Pin,
    PinOff,
    RotateCw,
    X
} from '@dag/icons'
import { $t, useI18n } from '@dag/locales'
import { getTabKey, useAccessStore, useTabbarStore } from '@dag/stores'
import { filterTree } from '@dag/utils'

export function useTabbar() {
    const route = useRoute()
    const router = useRouter()
    const tabbarStore = useTabbarStore()
    const accessStore = useAccessStore()
    const {
        getTabDisableState,
        closeCurrentTab,
        toggleTabPin,
        refreshTab,
        openTabInNewWindow,
        closeLeftTabs,
        closeRightTabs,
        closeOtherTabs,
        closeAllTabs,
        closeTabByKey
    } = useTabs()
    const { contentIsMaximize, toggleMaximize } = useContentMaximize()
    const { locale } = useI18n()

    const currentTabs = ref<RouteLocationNormalizedGeneric[]>([])

    const currentActive = computed(() => getTabKey(route))

    /** 右键菜单列表 */
    const createContextMenus = (tab: TabDefinition) => {
        const {
            disabledCloseCurrent,
            disabledRefresh,
            disabledCloseLeft,
            disabledCloseRight,
            disabledCloseOther,
            disabledCloseAll
        } = getTabDisableState(tab)

        const affixTab = tab?.meta?.affixTab ?? false

        const menus: IContextMenuItem[] = [
            {
                disabled: disabledCloseCurrent,
                handler: async () => {
                    await closeCurrentTab()
                },
                icon: X,
                key: 'close',
                text: $t('preferences.tabbar.contextMenu.close')
            },
            {
                handler: async () => {
                    await toggleTabPin(tab)
                },
                icon: affixTab ? PinOff : Pin,
                key: 'affix',
                text: affixTab
                    ? $t('preferences.tabbar.contextMenu.unpin')
                    : $t('preferences.tabbar.contextMenu.pin')
            },
            {
                handler: async () => {
                    if (!contentIsMaximize.value) {
                        await router.push(tab.fullPath)
                    }
                    toggleMaximize()
                },
                icon: contentIsMaximize.value ? Minimize2 : Fullscreen,
                key: contentIsMaximize.value ? 'restore-maximize' : 'maximize',
                text: contentIsMaximize.value
                    ? $t('preferences.tabbar.contextMenu.restoreMaximize')
                    : $t('preferences.tabbar.contextMenu.maximize')
            },
            {
                disabled: disabledRefresh,
                handler: () => refreshTab(),
                icon: RotateCw,
                key: 'reload',
                text: $t('preferences.tabbar.contextMenu.reload')
            },
            {
                handler: async () => {
                    await openTabInNewWindow(tab)
                },
                icon: ExternalLink,
                key: 'open-in-new-window',
                separator: true,
                text: $t('preferences.tabbar.contextMenu.openInNewWindow')
            },
            {
                disabled: disabledCloseLeft,
                handler: async () => {
                    await closeLeftTabs(tab)
                },
                icon: ArrowLeftToLine,
                key: 'close-left',
                text: $t('preferences.tabbar.contextMenu.closeLeft')
            },
            {
                disabled: disabledCloseRight,
                handler: async () => {
                    await closeRightTabs(tab)
                },
                icon: ArrowRightToLine,
                key: 'close-right',
                text: $t('preferences.tabbar.contextMenu.closeRight')
            },
            {
                disabled: disabledCloseOther,
                handler: async () => {
                    await closeOtherTabs(tab)
                },
                icon: FoldHorizontal,
                key: 'close-other',
                text: $t('preferences.tabbar.contextMenu.closeOther')
            },
            {
                disabled: disabledCloseAll,
                handler: closeAllTabs,
                icon: ArrowRightLeft,
                key: 'close-all',
                text: $t('preferences.tabbar.contextMenu.closeAll')
            }
        ]

        return menus.filter((item) => tabbarStore.getMenuList.includes(item.key))
    }

    /** 初始化固定标签页 */
    const initAffixTabs = () => {
        const affixTabs = filterTree(router.getRoutes(), (route) => {
            return !!route.meta?.affixTab
        })
        tabbarStore.setAffixTabs(affixTabs)
    }

    /** 关闭 */
    const handleClose = async (key: string) => {
        await closeTabByKey(key)
    }

    /** 点击跳转路由 */
    const handleClick = (key: string) => {
        const { fullPath, path } = tabbarStore.getTabByKey(key)
        router.push(fullPath || path)
    }

    watch(
        [() => tabbarStore.getTabs, () => tabbarStore.updateTime, () => locale.value],
        ([tabs]) => {
            currentTabs.value = tabs.map((tab) => ({
                ...tab,
                meta: {
                    ...tab?.meta,
                    title: $t(tab?.meta?.title)
                }
            }))
        }
    )

    watch(
        () => accessStore.accessMenus,
        () => {
            initAffixTabs()
        },
        { immediate: true }
    )

    watch(
        () => route.fullPath,
        () => {
            const meta = route.matched?.[route.matched.length - 1]?.meta
            tabbarStore.addTab({
                ...route,
                meta: meta || route.meta
            })
        },
        { immediate: true }
    )

    return {
        currentActive,
        currentTabs,
        handleClose,
        handleClick,
        createContextMenus
    }
}
