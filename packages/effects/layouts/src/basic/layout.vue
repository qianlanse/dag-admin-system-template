<script setup lang="ts">
    import type { MenuRecordRaw } from '@dag/types'

    import { computed, useSlots } from 'vue'

    import { $t } from '@dag/locales'
    import { preferences, updatePreferences, usePreferences } from '@dag/preferences'
    import { cloneDeep, mapTree } from '@dag/utils'

    import { DagAdminLayout } from '@dag-core/layout-ui'
    import { DagLogo } from '@dag-core/shadcn-ui'

    import { Breadcrumb } from '../widgets'
    import { LayoutHeader } from './header'
    import { LayoutMenu, useMixedMenu } from './menu'

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
        layout
    } = usePreferences()

    const { sidebarVisible, sidebarMenus, sidebarActive, handleMenuOpen, handleMenuSelect } =
        useMixedMenu()
    const slots = useSlots()

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
</script>

<template>
    <DagAdminLayout
        :content-compact="preferences.app.contentCompact"
        :footer-enable="preferences.footer.enable"
        :footer-fixed="preferences.footer.fixed"
        :header-hidden="preferences.header.hidden"
        :header-mode="preferences.header.mode"
        :header-theme="headerTheme"
        :header-toggle-sidebar-button="preferences.widget.sidebarToggle"
        :header-visible="preferences.header.enable"
        :is-mobile="preferences.app.isMobile"
        :layout="layout"
        :sidebar-enable="sidebarVisible"
        :sidebar-collapse="preferences.sidebar.collapsed"
        :sidebar-collapse-show-title="preferences.sidebar.collapsedShowTitle"
        :sidebar-collapsed-button="preferences.sidebar.collapsedButton"
        :sidebar-fixed-button="preferences.sidebar.fixedButton"
        :sidebar-expand-on-hover="preferences.sidebar.expandOnHover"
        :sidebar-extar-collapse="preferences.sidebar.extraCollapse"
        :sidebar-hidden="preferences.sidebar.hidden"
        :sidebar-theme="sidebarTheme"
        :sidebar-width="preferences.sidebar.width"
        :tabbar-enable="preferences.tabbar.enable"
        :tabbar-height="preferences.tabbar.height"
        @toggle-sidebar="handleToggleSidebar"
        @update:sidebar-collapse="
            (value: boolean) => updatePreferences({ sidebar: { collapsed: value } })
        "
        @update:sidebar-expand-on-hover="
            (value: boolean) => updatePreferences({ sidebar: { expandOnHover: value } })
        "
    >
        <!-- Logo标题 -->
        <template #logo>
            <DagLogo
                v-if="preferences.logo.enable"
                :class="logoClass"
                :collapsed="logoCollapsed"
                :src="preferences.logo.source"
                :text="preferences.app.name"
                :theme="showHeaderNav ? headerTheme : theme"
            >
                <template v-if="$slots['logo-text']" #text>
                    <slot name="logo-text"></slot>
                </template>
            </DagLogo>
        </template>

        <!-- 顶部区域 -->
        <template #header>
            <LayoutHeader :theme="theme" @clear-preferences-and-logout="clearPreferencesAndLogout">
                <template #breadcrumb>
                    <Breadcrumb
                        :hide-when-only-one="preferences.breadcrumb.hideOnlyOne"
                        :show-home="preferences.breadcrumb.showHome"
                        :show-icon="preferences.breadcrumb.showIcon"
                        :type="preferences.breadcrumb.styleType"
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
    </DagAdminLayout>
</template>
