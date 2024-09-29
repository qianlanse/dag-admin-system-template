import type { LocaleSetupOptions, SupportedLanguagesType } from '@dag/locales'

import type { App } from 'vue'

import { $t, setupI18n as coreI18n, loadLocalesMap } from '@dag/locales'

const modules = import.meta.glob('./langs/*.json')
const localesMap = loadLocalesMap(modules)

/**
 * 加载应用特有的语言包
 * @param lang
 */
async function loadMessages(lang: SupportedLanguagesType) {
    const appLocaleMessages = await localesMap[lang]?.()
    return appLocaleMessages?.default
}

/**
 * 初始化i18n配置
 * @param app
 * @param options
 */
async function setupI18n(app: App, options: LocaleSetupOptions = {}) {
    await coreI18n(app, {
        defaultLocale: 'zh-CN',
        loadMessages,
        missingWarn: import.meta.env.DEV,
        ...options
    })
}

export { $t, setupI18n }
