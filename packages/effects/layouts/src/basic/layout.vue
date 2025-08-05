<script setup lang="ts">
    import type { MenuRecordRaw } from '@dag/types'

    import { computed, useSlots } from 'vue'

    import { $t } from '@dag/locales'
    import { preferences, updatePreferences, usePreferences } from '@dag/preferences'
    import { useAccessStore } from '@dag/stores'
    import { cloneDeep, mapTree } from '@dag/utils'

    import { DagAdminLayout } from '@dag-core/layout-ui'
    import { DagLogo } from '@dag-core/shadcn-ui'

    import { Breadcrumb, CheckUpdates, Preferences } from '../widgets'
    import { LayoutContent, LayoutContentSpinner } from './content'
    import { Copyright } from './copyright'
    import { LayoutFooter } from './footer'
    import { LayoutHeader } from './header'
    import {
        LayoutExtraMenu,
        LayoutMenu,
        LayoutMixedMenu,
        useExtraMenu,
        useMixedMenu
    } from './menu'
    import { LayoutTabbar } from './tabbar'

    defineOptions({ name: 'BasicLayout' })

    const emits = defineEmits<{ clearPreferencesAndLogout: []; clickLogo: [] }>()

    const {
        isDark,
        sidebarCollapsed,
        isMixedNav,
        isMobile,
        isHeaderNav,
        isHeaderMixedNav,
        isHeaderSidebarNav,
        isSideMixedNav,
        theme,
        preferencesButtonPosition,
        layout
    } = usePreferences()

    const {
        sidebarVisible,
        sidebarMenus,
        sidebarActive,
        mixHeaderMenus,
        headerActive,
        headerMenus,
        handleMenuOpen,
        handleMenuSelect
    } = useMixedMenu()

    const {
        extraActiveMenu,
        extraMenus,
        sidebarExtraVisible,
        handleDefaultSelect,
        handleMenuMouseEnter,
        handleMixedMenuSelect,
        handleSideMouseLeave
    } = useExtraMenu(mixHeaderMenus)

    const slots = useSlots()
    const accessStore = useAccessStore()

    const logoClass = computed(() => {
        const { collapsedShowTitle } = preferences.sidebar
        const classes: string[] = []

        if (collapsedShowTitle && sidebarCollapsed.value && !isMixedNav.value) {
            classes.push('mx-auto')
        }

        return classes.join(' ')
    })

    const logoCollapsed = computed(() => {
        if (isMobile.value && sidebarCollapsed.value) {
            return true
        }

        if (isHeaderNav.value || isMixedNav.value || isHeaderSidebarNav.value) {
            return false
        }

        return sidebarCollapsed.value || isSideMixedNav.value || isHeaderMixedNav.value
    })

    const showHeaderNav = computed(() => {
        return !isMobile.value && (isHeaderNav.value || isMixedNav.value || isHeaderMixedNav.value)
    })

    const headerTheme = computed(() => {
        const dark = isDark.value || preferences.theme.semiDarkHeader
        return dark ? 'dark' : 'light'
    })

    const sidebarTheme = computed(() => {
        const dark = isDark.value || preferences.theme.semiDarkSidebar
        return dark ? 'dark' : 'light'
    })

    const isMenuRounded = computed(() => preferences.navigation.styleType === 'rounded')

    const headerSlots = computed(() =>
        Object.keys(slots).filter((key) => key.startsWith('header-'))
    )

    /**
     * 包装菜单翻译菜单名称
     * @param menus 原始菜单数据
     * @param deep 是否深度包装。对于双列布局，只需要包装第一层，因为更深层的数据会在扩展菜单中重新包装
     */
    function wrapperMenus(menus: MenuRecordRaw[], deep: boolean = true) {
        return deep
            ? mapTree(menus, (item) => {
                  return { ...cloneDeep(item), name: $t(item.name) }
              })
            : menus.map((item) => {
                  return { ...cloneDeep(item), name: $t(item.name) }
              })
    }

    /** 切换显示/隐藏侧边栏 */
    function handleToggleSidebar() {
        updatePreferences({
            sidebar: {
                hidden: !preferences.sidebar.hidden
            }
        })
    }

    /** 清除配置并登出 */
    function clearPreferencesAndLogout() {
        emits('clearPreferencesAndLogout')
    }

    /** 点击Logo */
    function handleClickLogo() {
        emits('clickLogo')
    }
</script>

<template>
    <DagAdminLayout
        v-model:sidebar-extra-visible="sidebarExtraVisible"
        :content-compact="preferences.app.contentCompact"
        :content-compact-width="preferences.app.contentCompactWidth"
        :content-padding="preferences.app.contentPadding"
        :content-padding-bottom="preferences.app.contentPaddingBottom"
        :content-padding-left="preferences.app.contentPaddingLeft"
        :content-padding-right="preferences.app.contentPaddingRight"
        :content-padding-top="preferences.app.contentPaddingTop"
        :footer-enable="preferences.footer.enable"
        :footer-fixed="preferences.footer.fixed"
        :footer-height="preferences.footer.height"
        :header-height="preferences.header.height"
        :header-hidden="preferences.header.hidden"
        :header-mode="preferences.header.mode"
        :header-theme="headerTheme"
        :header-toggle-sidebar-button="preferences.widget.sidebarToggle"
        :header-visible="preferences.header.enable"
        :is-mobile="preferences.app.isMobile"
        :layout="layout"
        :sidebar-collapse="preferences.sidebar.collapsed"
        :sidebar-collapse-show-title="preferences.sidebar.collapsedShowTitle"
        :sidebar-enable="sidebarVisible"
        :sidebar-collapsed-button="preferences.sidebar.collapsedButton"
        :sidebar-fixed-button="preferences.sidebar.fixedButton"
        :sidebar-expand-on-hover="preferences.sidebar.expandOnHover"
        :sidebar-extra-collapse="preferences.sidebar.extraCollapse"
        :sidebar-extra-collapsed-width="preferences.sidebar.extraCollapsedWidth"
        :sidebar-hidden="preferences.sidebar.hidden"
        :sidebar-mixed-width="preferences.sidebar.mixedWidth"
        :sidebar-theme="sidebarTheme"
        :sidebar-width="preferences.sidebar.width"
        :side-collapse-width="preferences.sidebar.collapseWidth"
        :tabbar-enable="preferences.tabbar.enable"
        :tabbar-height="preferences.tabbar.height"
        :z-index="preferences.app.zIndex"
        @side-mouse-leave="handleSideMouseLeave"
        @toggle-sidebar="handleToggleSidebar"
        @update:sidebar-collapse="
            (value: boolean) => updatePreferences({ sidebar: { collapsed: value } })
        "
        @update:sidebar-enable="
            (value: boolean) => updatePreferences({ sidebar: { enable: value } })
        "
        @update:sidebar-expand-on-hover="
            (value: boolean) => updatePreferences({ sidebar: { expandOnHover: value } })
        "
        @update:sidebar-extra-collapse="
            (value: boolean) => updatePreferences({ sidebar: { extraCollapse: value } })
        "
    >
        <!-- Logo标题 -->
        <template #logo>
            <DagLogo
                v-if="preferences.logo.enable"
                :fit="preferences.logo.fit"
                :class="logoClass"
                :collapsed="logoCollapsed"
                :src="preferences.logo.source"
                :text="preferences.app.name"
                :theme="showHeaderNav ? headerTheme : theme"
                @click="handleClickLogo"
            >
                <template v-if="$slots['logo-text']" #text>
                    <slot name="logo-text"></slot>
                </template>
            </DagLogo>
        </template>

        <!-- 顶部区域 -->
        <template #header>
            <LayoutHeader :theme="theme" @clear-preferences-and-logout="clearPreferencesAndLogout">
                <template v-if="!showHeaderNav && preferences.breadcrumb.enable" #breadcrumb>
                    <Breadcrumb
                        :hide-when-only-one="preferences.breadcrumb.hideOnlyOne"
                        :show-home="preferences.breadcrumb.showHome"
                        :show-icon="preferences.breadcrumb.showIcon"
                        :type="preferences.breadcrumb.styleType"
                    />
                </template>
                <template v-if="showHeaderNav" #menu>
                    <LayoutMenu
                        :default-active="headerActive"
                        :menus="wrapperMenus(headerMenus)"
                        :rounded="isMenuRounded"
                        :theme="headerTheme"
                        class="w-full"
                        mode="horizontal"
                        @select="handleMenuSelect"
                    />
                </template>
                <template #user-dropdown>
                    <slot name="user-dropdown"></slot>
                </template>
                <template #notification>
                    <slot name="notification"></slot>
                </template>
                <template v-for="item in headerSlots" #[item]>
                    <slot :name="item"></slot>
                </template>
            </LayoutHeader>
        </template>

        <!-- 侧边菜单区域 -->
        <template #menu>
            <LayoutMenu
                :accordion="preferences.navigation.accordion"
                :collapse="preferences.sidebar.collapsed"
                :collapse-show-title="preferences.sidebar.collapsedShowTitle"
                :default-active="sidebarActive"
                :menus="wrapperMenus(sidebarMenus)"
                :rounded="isMenuRounded"
                :theme="sidebarTheme"
                mode="vertical"
                @open="handleMenuOpen"
                @select="handleMenuSelect"
            />
        </template>

        <!-- 混合侧栏主菜单 -->
        <template #mixed-menu>
            <LayoutMixedMenu
                :active-path="extraActiveMenu"
                :menus="wrapperMenus(mixHeaderMenus, false)"
                :rounded="isMenuRounded"
                :theme="sidebarTheme"
                @default-select="handleDefaultSelect"
                @enter="handleMenuMouseEnter"
                @select="handleMixedMenuSelect"
            />
        </template>

        <!-- 混合侧栏子菜单 -->
        <template #side-extra>
            <LayoutExtraMenu
                :accordion="preferences.navigation.accordion"
                :collapse="preferences.sidebar.extraCollapse"
                :menus="wrapperMenus(extraMenus)"
                :rounded="isMenuRounded"
                :theme="sidebarTheme"
            />
        </template>

        <template #side-extra-title>
            <DagLogo
                v-if="preferences.logo.enable"
                :fit="preferences.logo.fit"
                :text="preferences.app.name"
                :theme="theme"
            >
                <template v-if="$slots['logo-text']" #text>
                    <slot name="logo-text"></slot>
                </template>
            </DagLogo>
        </template>

        <!-- 路由导航栏 -->
        <template #tabbar>
            <LayoutTabbar
                v-if="preferences.tabbar.enable"
                :show-icon="preferences.tabbar.showIcon"
                :theme="theme"
            />
        </template>

        <!-- 主体内容 -->
        <template #content>
            <LayoutContent />
        </template>

        <!-- 主体内容加载动画 -->
        <template v-if="preferences.transition.loading" #content-overlay>
            <LayoutContentSpinner />
        </template>

        <!-- 底部详情模块 -->
        <template v-if="preferences.footer.enable" #footer>
            <LayoutFooter>
                <Copyright v-if="preferences.copyright.enable" v-bind="preferences.copyright" />
            </LayoutFooter>
        </template>

        <!-- 扩展模块 -->
        <template #extra>
            <slot name="extra"></slot>

            <!-- 检测版本更新 -->
            <CheckUpdates
                v-if="preferences.app.enableCheckUpdates"
                :check-updates-interval="preferences.app.checkUpdatesInterval"
            />

            <!-- 锁屏 -->
            <Transition v-if="preferences.widget.lockScreen" name="slide-up">
                <slot v-if="accessStore.isLockScreen" name="lock-screen"></slot>
            </Transition>

            <!-- 偏好设置(Fixed模式) -->
            <template v-if="preferencesButtonPosition.fixed">
                <Preferences class="z-100 fixed bottom-20 right-0" />
            </template>
        </template>
    </DagAdminLayout>
</template>
