import type { Preferences } from './types'

export const defaultPreferences: Preferences = {
    app: {
        accessMode: 'frontend',
        authPageLayout: 'panel-right',
        contentCompact: 'wide',
        defaultAvatar: 'https://www.radix-vue.com/logo.svg',
        defaultHomePath: '/analytics',
        dynamicTitle: true,
        enablePreferences: true,
        enableRefreshToken: false,
        isMobile: false,
        layout: 'sidebar-nav',
        locale: 'zh-CN',
        loginExpiredMode: 'page',
        name: 'Dag Admin',
        preferencesButtonPosition: 'auto'
    },
    breadcrumb: {
        enable: true,
        hideOnlyOne: false,
        showHome: false,
        showIcon: true,
        styleType: 'normal'
    },
    copyright: {
        companyName: 'Dag',
        companySiteLink: 'https://www.dagteam.cn',
        date: '2025',
        enable: true,
        icp: '',
        icpLink: '',
        settingShow: true
    },
    footer: {
        enable: false,
        fixed: false
    },
    header: {
        enable: true,
        hidden: false,
        menuAlign: 'start',
        mode: 'fixed'
    },
    logo: {
        enable: true,
        source: 'https://www.radix-vue.com/logo.svg'
    },
    navigation: {
        accordion: true,
        split: true,
        styleType: 'rounded'
    },
    shortcutKeys: {
        enable: true,
        globalLockScreen: true,
        globalLogout: true,
        globalPreferences: true,
        globalSearch: true
    },
    sidebar: {
        autoActivateChild: false,
        collapsed: false,
        collapsedButton: true,
        collapsedShowTitle: false,
        enable: true,
        expandOnHover: true,
        extraCollapse: false,
        fixedButton: true,
        hidden: false,
        width: 224
    },
    tabbar: {
        draggable: true,
        enable: true,
        height: 38,
        keepAlive: true,
        maxCount: 0,
        middleClickToClose: false,
        persist: true,
        showIcon: true,
        showMaximize: true,
        showMore: true,
        styleType: 'chrome',
        wheelable: true
    },
    theme: {
        builtinType: 'default',
        colorDestructive: 'hsl(348 100% 61%)',
        colorPrimary: 'hsl(212 100% 45%)',
        colorSuccess: 'hsl(144 57% 58%)',
        colorWarning: 'hsl(42 84% 61%)',
        mode: 'dark',
        radius: '0.5',
        semiDarkHeader: false,
        semiDarkSidebar: false
    },
    transition: {
        enable: true,
        loading: true,
        name: 'fade-slide',
        progress: true
    },
    widget: {
        fullscreen: true,
        globalSearch: true,
        languageToggle: true,
        lockScreen: true,
        notification: true,
        refresh: true,
        sidebarToggle: true,
        themeToggle: true
    }
}
