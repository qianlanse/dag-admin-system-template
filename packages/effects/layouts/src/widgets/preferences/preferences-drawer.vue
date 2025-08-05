<script setup lang="ts">
    import type {
        BuiltinThemeType,
        ContentCompactType,
        LayoutHeaderMenuAlignType,
        LayoutHeaderModeType,
        LayoutType,
        PreferencesButtonPositionType,
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
        Animation,
        Block,
        Breadcrumb,
        BuiltinTheme,
        ColorMode,
        Content,
        Copyright,
        Footer,
        General,
        GlobalShortcutKeys,
        Header,
        Layout,
        Navigation,
        Radius,
        Sidebar,
        Tabbar,
        Theme,
        Widget
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

    /**
     * 外观
     */
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

    /**
     * 布局
     */
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
    // 小部件
    const widgetGlobalSearch = defineModel<boolean>('widgetGlobalSearch')
    const widgetThemeToggle = defineModel<boolean>('widgetThemeToggle')
    const widgetLanguageToggle = defineModel<boolean>('widgetLanguageToggle')
    const widgetFullscreen = defineModel<boolean>('widgetFullscreen')
    const widgetNotification = defineModel<boolean>('widgetNotification')
    const widgetLockScreen = defineModel<boolean>('widgetLockScreen')
    const widgetSidebarToggle = defineModel<boolean>('widgetSidebarToggle')
    const widgetRefresh = defineModel<boolean>('widgetRefresh')
    const appPreferencesButtonPosition = defineModel<PreferencesButtonPositionType>(
        'appPreferencesButtonPosition'
    )
    // 底栏
    const footerEnable = defineModel<boolean>('footerEnable')
    const footerFixed = defineModel<boolean>('footerFixed')
    // 版权
    const copyrightSettingShow = defineModel<boolean>('copyrightSettingShow')
    const copyrightEnable = defineModel<boolean>('copyrightEnable')
    const copyrightCompanyName = defineModel<string>('copyrightCompanyName')
    const copyrightCompanySiteLink = defineModel<string>('copyrightCompanySiteLink')
    const copyrightDate = defineModel<string>('copyrightDate')
    const copyrightIcp = defineModel<string>('copyrightIcp')
    const copyrightIcpLink = defineModel<string>('copyrightIcpLink')

    /**
     * 快捷键
     */
    // 全局
    const shortcutKeysEnable = defineModel<boolean>('shortcutKeysEnable')
    const shortcutKeysGlobalSearch = defineModel<boolean>('shortcutKeysGlobalSearch')
    const shortcutKeysGlobalLogout = defineModel<boolean>('shortcutKeysGlobalLogout')
    const shortcutKeysGlobalLockScreen = defineModel<boolean>('shortcutKeysGlobalLockScreen')

    /**
     * 通用
     */
    const appLocale = defineModel<string>('appLocale')
    const appDynamicTitle = defineModel<boolean>('appDynamicTitle')
    const appWatermark = defineModel<boolean>('appWatermark')
    const appEnableCheckUpdates = defineModel<boolean>('appEnableCheckUpdates')
    // 动画
    const transitionProgress = defineModel<boolean>('transitionProgress')
    const transitionLoading = defineModel<boolean>('transitionLoading')
    const transitionEnable = defineModel<boolean>('transitionEnable')
    const transitionName = defineModel<string>('transitionName')

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
                        <Block :title="$t('preferences.widget.title')">
                            <Widget
                                v-model:widget-global-search="widgetGlobalSearch"
                                v-model:widget-theme-toggle="widgetThemeToggle"
                                v-model:widget-language-toggle="widgetLanguageToggle"
                                v-model:widget-fullscreen="widgetFullscreen"
                                v-model:widget-notification="widgetNotification"
                                v-model:widget-lock-screen="widgetLockScreen"
                                v-model:widget-sidebar-toggle="widgetSidebarToggle"
                                v-model:widget-refresh="widgetRefresh"
                                v-model:app-preferences-button-position="
                                    appPreferencesButtonPosition
                                "
                            />
                        </Block>
                        <Block :title="$t('preferences.footer.title')">
                            <Footer
                                v-model:footer-enable="footerEnable"
                                v-model:footer-fixed="footerFixed"
                            />
                        </Block>
                        <Block
                            v-if="copyrightSettingShow"
                            :title="$t('preferences.copyright.title')"
                        >
                            <Copyright
                                v-model:copyright-enable="copyrightEnable"
                                v-model:copyright-company-name="copyrightCompanyName"
                                v-model:copyright-company-site-link="copyrightCompanySiteLink"
                                v-model:copyright-date="copyrightDate"
                                v-model:copyright-icp="copyrightIcp"
                                v-model:copyright-icp-link="copyrightIcpLink"
                                :disabled="!footerEnable"
                            />
                        </Block>
                    </template>
                    <template #shortcutKey>
                        <Block :title="$t('preferences.shortcutKeys.global')">
                            <GlobalShortcutKeys
                                v-model:shortcut-keys-enable="shortcutKeysEnable"
                                v-model:shortcut-keys-global-search="shortcutKeysGlobalSearch"
                                v-model:shortcut-keys-global-logout="shortcutKeysGlobalLogout"
                                v-model:shortcut-keys-global-lock-screen="
                                    shortcutKeysGlobalLockScreen
                                "
                            />
                        </Block>
                    </template>
                    <template #general>
                        <Block :title="$t('preferences.general')">
                            <General
                                v-model:app-locale="appLocale"
                                v-model:app-dynamic-title="appDynamicTitle"
                                v-model:app-watermark="appWatermark"
                                v-model:app-enable-check-updates="appEnableCheckUpdates"
                            />
                        </Block>
                        <Block :title="$t('preferences.animation.title')">
                            <Animation
                                v-model:transition-progress="transitionProgress"
                                v-model:transition-loading="transitionLoading"
                                v-model:transition-enable="transitionEnable"
                                v-model:transition-name="transitionName"
                            />
                        </Block>
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
