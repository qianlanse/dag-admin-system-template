import { computed } from 'vue'

import { preferencesManager } from './preferences'
import { isDarkTheme } from './update-css-variables'

export function usePreferences() {
    const preferences = preferencesManager.getPreferences()
    const appPreferen = computed(() => preferences.app)

    /**
     * 验证是否为暗黑模式
     */
    const isDark = computed(() => isDarkTheme(preferences.theme.mode))

    /**
     * 登录注册页面布局是否为左侧
     */
    const authPanelLeft = computed(() => appPreferen.value.authPageLayout === 'panel-left')

    /**
     * 登录注册页面布局是否为中间
     */
    const authPanelCenter = computed(() => appPreferen.value.authPageLayout === 'panel-center')

    /**
     * 登录注册页面布局是否为右侧
     */
    const authPanelRight = computed(() => appPreferen.value.authPageLayout === 'panel-right')

    return {
        authPanelCenter,
        authPanelLeft,
        authPanelRight,
        isDark
    }
}
