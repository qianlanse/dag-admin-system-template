import type { Preferences } from './types'

export const defaultPreferences: Preferences = {
    app: {
        accessMode: 'frontend',
        authPageLayout: 'panel-right',
        dynamicTitle: true,
        locale: 'zh-CN',
        name: 'Dag Admin'
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
    logo: {
        enable: true,
        source: 'https://www.radix-vue.com/logo.svg'
    },
    theme: {
        builtinType: 'default',
        colorDestructive: 'hsl(348 100% 61%)',
        colorPrimary: 'hsl(212 100% 45%)',
        colorSuccess: 'hsl(144 57% 58%)',
        colorWarning: 'hsl(42 84% 61%)',
        mode: 'light',
        radius: '0.5',
        semiDarkHeader: false,
        semiDarkSidebar: true
    },
    transition: {
        enable: true,
        loading: true,
        name: 'fade-slide',
        progress: true
    }
}
