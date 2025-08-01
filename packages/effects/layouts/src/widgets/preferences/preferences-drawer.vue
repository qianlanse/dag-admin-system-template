<script setup lang="ts">
    import type {
        BuiltinThemeType,
        ContentCompactType,
        LayoutHeaderMenuAlignType,
        LayoutHeaderModeType,
        LayoutType,
        ThemeModeType
    } from '@dag/types'

    import type { SegmentedItem } from '@dag-core/shadcn-ui'

    import { computed, ref } from 'vue'

    import { Copy, RotateCw } from '@dag/icons'
    import { $t, loadLocaleMessages } from '@dag/locales'
    import {
        clearPreferencesCache,
        preferences,
        resetPreferences,
        usePreferences
    } from '@dag/preferences'

    import { useDagDrawer } from '@dag-core/popup-ui'
    import { DagButton, DagIconButton, DagSegmented } from '@dag-core/shadcn-ui'
    import { globalShareState } from '@dag-core/shared/global-state'

    import { useClipboard } from '@vueuse/core'

    import {
        Block,
        Breadcrumb,
        BuiltinTheme,
        ColorMode,
        Content,
        Header,
        Layout,
        Navigation,
        Radius,
        Sidebar,
        Tabbar,
        Theme
    } from './blocks'

    const emit = defineEmits<{ clearPreferencesAndLogout: [] }>()

    const message = globalShareState.getMessage()

    const {
        diffPreference,
        isDark,
        isSideMode,
        isFullContent,
        isMixedNav,
        isHeaderNav,
        isSideNav,
        isSideMixedNav,
        isHeaderSidebarNav
    } = usePreferences()
    const { copy } = useClipboard({ legacy: true })
    const [Drawer] = useDagDrawer()

    const activeTab = ref('layout')

    /** 外观 */
    const themeMode = defineModel<ThemeModeType>('themeMode')
    const themeSemiDarkSidebar = defineModel<boolean>('themeSemiDarkSidebar')
    const themeSemiDarkHeader = defineModel<boolean>('themeSemiDarkHeader')
    // 内置主题
    const themeBuiltinType = defineModel<BuiltinThemeType>('themeBuiltinType')
    const themeColorPrimary = defineModel<string>('themeColorPrimary')
    // 圆角
    const themeRadius = defineModel<string>('themeRadius')
    // 其它
    const appColorWeakMode = defineModel<boolean>('appColorWeakMode')
    const appColorGrayMode = defineModel<boolean>('appColorGrayMode')

    /** 布局 */
    const appLayout = defineModel<LayoutType>('appLayout')
    // 内容
    const appContentCompact = defineModel<ContentCompactType>('appContentCompact')
    // 侧边栏
    const sidebarEnable = defineModel<boolean>('sidebarEnable')
    const sidebarCollapsed = defineModel<boolean>('sidebarCollapsed')
    const sidebarExpandOnHover = defineModel<boolean>('sidebarExpandOnHover')
    const sidebarCollapsedShowTitle = defineModel<boolean>('sidebarCollapsedShowTitle')
    const sidebarAutoActivateChild = defineModel<boolean>('sidebarAutoActivateChild')
    const sidebarCollapsedButton = defineModel<boolean>('sidebarCollapsedButton')
    const sidebarFixedButton = defineModel<boolean>('sidebarFixedButton')
    const sidebarWidth = defineModel<number>('sidebarWidth')
    // 顶栏
    const headerEnable = defineModel<boolean>('headerEnable')
    const headerMode = defineModel<LayoutHeaderModeType>('headerMode')
    const headerMenuAlign = defineModel<LayoutHeaderMenuAlignType>('headerMenuAlign')
    // 导航菜单
    const navigationStyleType = defineModel<string>('navigationStyleType')
    const navigationSplit = defineModel<boolean>('navigationSplit')
    const navigationAccordion = defineModel<boolean>('navigationAccordion')
    // 面包屑导航
    const breadcrumbEnable = defineModel<boolean>('breadcrumbEnable')
    const breadcrumbHideOnlyOne = defineModel<boolean>('breadcrumbHideOnlyOne')
    const breadcrumbShowIcon = defineModel<boolean>('breadcrumbShowIcon')
    const breadcrumbShowHome = defineModel<boolean>('breadcrumbShowHome')
    const breadcrumbStyleType = defineModel<string>('breadcrumbStyleType')
    // 标签栏
    const tabbarEnable = defineModel<boolean>('tabbarEnable')
    const tabbarPersist = defineModel<boolean>('tabbarPersist')
    const tabbarMaxCount = defineModel<number>('tabbarMaxCount')
    const tabbarDraggable = defineModel<boolean>('tabbarDraggable')
    const tabbarWheelable = defineModel<boolean>('tabbarWheelable')
    const tabbarMiddleClickToClose = defineModel<boolean>('tabbarMiddleClickToClose')
    const tabbarShowIcon = defineModel<boolean>('tabbarShowIcon')
    const tabbarShowMore = defineModel<boolean>('tabbarShowMore')
    const tabbarShowMaximize = defineModel<boolean>('tabbarShowMaximize')
    const tabbarStyleType = defineModel<string>('tabbarStyleType')

    const tabs = computed((): SegmentedItem[] => {
        return [
            {
                label: $t('preferences.appearance'),
                value: 'appearance'
            },
            {
                label: $t('preferences.layout'),
                value: 'layout'
            },
            {
                label: $t('preferences.shortcutKeys.title'),
                value: 'shortcutKey'
            },
            {
                label: $t('preferences.general'),
                value: 'general'
            }
        ]
    })

    const showBreadcrumbConfig = computed(() => {
        return (
            !isFullContent.value &&
            !isMixedNav.value &&
            !isHeaderNav.value &&
            preferences.header.enable
        )
    })

    /** 重置 */
    async function handleReset() {
        if (!diffPreference.value) {
            return
        }
        resetPreferences()
        await loadLocaleMessages(preferences.app.locale)
    }

    /** 复制改变的值 */
    async function handleCopy() {
        await copy(JSON.stringify(diffPreference.value, null, 2))

        message.copyPreferencesSuccess?.(
            $t('preferences.copyPreferencesSuccessTitle'),
            $t('preferences.copyPreferencesSuccess')
        )
    }

    /** 清除缓存退出登录 */
    function handleClearCache() {
        resetPreferences()
        clearPreferencesCache()
        emit('clearPreferencesAndLogout')
    }
</script>

<template>
    <div>
        <Drawer
            :description="$t('preferences.subtitle')"
            :title="$t('preferences.title')"
            class="sm:max-w-sm"
        >
            <template #extra>
                <div class="flex items-center">
                    <DagIconButton
                        :disabled="!diffPreference"
                        :tooltip="$t('preferences.resetTip')"
                        class="relative"
                    >
                        <span
                            v-if="diffPreference"
                            class="bg-primary absolute right-0.5 top-0.5 h-2 w-2 rounded"
                        ></span>
                        <RotateCw class="size-4" @click="handleReset" />
                    </DagIconButton>
                </div>
            </template>

            <div class="p-1">
                <DagSegmented v-model="activeTab" :tabs="tabs">
                    <template #appearance>
                        <Block :title="$t('preferences.theme.title')">
                            <Theme
                                v-model="themeMode"
                                v-model:theme-semi-dark-header="themeSemiDarkHeader"
                                v-model:theme-semi-dark-sidebar="themeSemiDarkSidebar"
                            />
                        </Block>
                        <Block :title="$t('preferences.theme.builtin.title')">
                            <BuiltinTheme
                                v-model="themeBuiltinType"
                                v-model:theme-color-primary="themeColorPrimary"
                                :is-dark="isDark"
                            />
                        </Block>
                        <Block :title="$t('preferences.theme.radius')">
                            <Radius v-model="themeRadius" />
                        </Block>
                        <Block :title="$t('preferences.other')">
                            <ColorMode
                                v-model:app-color-weak-mode="appColorWeakMode"
                                v-model:app-color-gray-mode="appColorGrayMode"
                            />
                        </Block>
                    </template>
                    <template #layout>
                        <Block :title="$t('preferences.layout')">
                            <Layout v-model="appLayout" />
                        </Block>
                        <Block :title="$t('preferences.content')">
                            <Content v-model="appContentCompact" />
                        </Block>
                        <Block :title="$t('preferences.sidebar.title')">
                            <Sidebar
                                v-model:sidebar-enable="sidebarEnable"
                                v-model:sidebar-collapsed="sidebarCollapsed"
                                v-model:sidebar-expand-on-hover="sidebarExpandOnHover"
                                v-model:sidebar-collapsed-show-title="sidebarCollapsedShowTitle"
                                v-model:sidebar-auto-activate-child="sidebarAutoActivateChild"
                                v-model:sidebar-collapsed-button="sidebarCollapsedButton"
                                v-model:sidebar-fixed-button="sidebarFixedButton"
                                v-model:sidebar-width="sidebarWidth"
                                :current-layout="appLayout"
                                :disabled="!isSideMode"
                            />
                        </Block>
                        <Block :title="$t('preferences.header.title')">
                            <Header
                                v-model:header-enable="headerEnable"
                                v-model:header-mode="headerMode"
                                v-model:header-menu-align="headerMenuAlign"
                                :disabled="isFullContent"
                            />
                        </Block>
                        <Block :title="$t('preferences.navigationMenu.title')">
                            <Navigation
                                v-model:navigation-style-type="navigationStyleType"
                                v-model:navigation-split="navigationSplit"
                                v-model:navigation-accordion="navigationAccordion"
                                :disabled="isFullContent"
                                :disabled-navigation-split="!isMixedNav"
                            />
                        </Block>
                        <Block :title="$t('preferences.breadcrumb.title')">
                            <Breadcrumb
                                v-model:breadcrumb-enable="breadcrumbEnable"
                                v-model:breadcrumb-hide-only-one="breadcrumbHideOnlyOne"
                                v-model:breadcrumb-show-icon="breadcrumbShowIcon"
                                v-model:breadcrumb-show-home="breadcrumbShowHome"
                                v-model:breadcrumb-style-type="breadcrumbStyleType"
                                :disabled="
                                    !showBreadcrumbConfig ||
                                    !(isSideNav || isSideMixedNav || isHeaderSidebarNav)
                                "
                            />
                        </Block>
                        <Block :title="$t('preferences.tabbar.title')">
                            <Tabbar
                                v-model:tabbar-enable="tabbarEnable"
                                v-model:tabbar-persist="tabbarPersist"
                                v-model:tabbar-max-count="tabbarMaxCount"
                                v-model:tabbar-draggable="tabbarDraggable"
                                v-model:tabbar-wheelable="tabbarWheelable"
                                v-model:tabbar-middle-click-to-close="tabbarMiddleClickToClose"
                                v-model:tabbar-show-icon="tabbarShowIcon"
                                v-model:tabbar-show-more="tabbarShowMore"
                                v-model:tabbar-show-maximize="tabbarShowMaximize"
                                v-model:tabbar-style-type="tabbarStyleType"
                            />
                        </Block>
                    </template>
                    <template #shortcutKey>
                        <span>shortcutKey</span>
                    </template>
                    <template #general>
                        <span>general</span>
                    </template>
                </DagSegmented>
            </div>

            <template #footer>
                <DagButton
                    :disabled="!diffPreference"
                    class="mx-4 w-full"
                    size="sm"
                    variant="default"
                    @click="handleCopy"
                >
                    <Copy class="mr-2 size-3" />
                    {{ $t('preferences.copyPreferences') }}
                </DagButton>
                <DagButton
                    :disabled="!diffPreference"
                    class="mr-4 w-full"
                    size="sm"
                    variant="ghost"
                    @click="handleClearCache"
                >
                    {{ $t('preferences.clearAndLogout') }}
                </DagButton>
            </template>
        </Drawer>
    </div>
</template>
