import { computed } from 'vue'

import { preferencesManager } from './preferences'
import { isDarkTheme } from './update-css-variables'

export function usePreferences() {
    const preferences = preferencesManager.getPreferences()
    const appPreferences = computed(() => preferences.app)
    const shortcutKeysPreferences = computed(() => preferences.shortcutKeys)

    /**
     * 验证是否为暗黑模式
     */
    const isDark = computed(() => isDarkTheme(preferences.theme.mode))

    /**
     * 登录注册页面布局是否为左侧
     */
    const authPanelLeft = computed(() => appPreferences.value.authPageLayout === 'panel-left')

    /**
     * 登录注册页面布局是否为中间
     */
    const authPanelCenter = computed(() => appPreferences.value.authPageLayout === 'panel-center')

    /**
     * 登录注册页面布局是否为右侧
     */
    const authPanelRight = computed(() => appPreferences.value.authPageLayout === 'panel-right')

    /** 侧边栏是否折叠 */
    const sidebarCollapsed = computed(() => preferences.sidebar.collapsed)

    /** 是否为混合导航模式 */
    const isMixedNav = computed(() => appPreferences.value.layout === 'mixed-nav')

    /** 是否为头部导航模式 */
    const isHeaderNav = computed(() => appPreferences.value.layout === 'header-nav')

    /** 是否为头部混合导航模式 */
    const isHeaderMixedNav = computed(() => appPreferences.value.layout === 'header-mixed-nav')

    /** 是否为顶部通栏+侧边导航模式 */
    const isHeaderSidebarNav = computed(() => appPreferences.value.layout === 'header-sidebar-nav')

    /** 是否侧边混合模式 */
    const isSideMixedNav = computed(() => appPreferences.value.layout === 'sidebar-mixed-nav')

    /** 是否移动端 */
    const isMobile = computed(() => appPreferences.value.isMobile)

    /** 主题 */
    const theme = computed(() => (isDark.value ? 'dark' : 'light'))

    /** 布局方式 */
    const layout = computed(() => (isMobile.value ? 'sidebar-nav' : appPreferences.value.layout))

    /** 是否全屏显示content,不需要侧边栏，底部，顶部和tab区域 */
    const isFullContent = computed(() => appPreferences.value.layout === 'full-content')

    /** 是否显示顶栏 */
    const isShowHeaderNav = computed(() => preferences.header.enable)

    /** 偏好设置按钮位置 */
    const preferencesButtonPosition = computed(() => {
        const { enablePreferences, preferencesButtonPosition } = preferences.app

        if (!enablePreferences) {
            return {
                fixed: false,
                header: false
            }
        }

        const { header, sidebar } = preferences
        const headerHidden = header.hidden
        const sidebarHidden = sidebar.hidden

        const contentIsMaximize = headerHidden && sidebarHidden
        const isHeaderPosition = preferencesButtonPosition === 'header'

        if (preferencesButtonPosition !== 'auto') {
            return {
                fixed: preferencesButtonPosition === 'fixed',
                header: isHeaderPosition
            }
        }

        const fixed =
            contentIsMaximize || isFullContent.value || isMobile.value || !isShowHeaderNav.value

        return {
            fixed,
            header: !fixed
        }
    })

    /** 是否启用全局搜索快捷键 */
    const globalSearchShortcutKey = computed(() => {
        const { enable, globalSearch } = shortcutKeysPreferences.value
        return enable && globalSearch
    })

    /** 是否启用全局注销快捷键 */
    const globalLogoutShortcutKey = computed(() => {
        const { enable, globalLogout } = shortcutKeysPreferences.value
        return enable && globalLogout
    })

    /** 是否启用全局锁屏快捷键 */
    const globalLockScreenShortcutKey = computed(() => {
        const { enable, globalLockScreen } = shortcutKeysPreferences.value
        return enable && globalLockScreen
    })

    return {
        authPanelCenter,
        authPanelLeft,
        authPanelRight,
        globalLockScreenShortcutKey,
        globalLogoutShortcutKey,
        globalSearchShortcutKey,
        isDark,
        isFullContent,
        isHeaderMixedNav,
        isHeaderNav,
        isHeaderSidebarNav,
        isMixedNav,
        isMobile,
        isShowHeaderNav,
        isSideMixedNav,
        layout,
        preferencesButtonPosition,
        sidebarCollapsed,
        theme
    }
}
