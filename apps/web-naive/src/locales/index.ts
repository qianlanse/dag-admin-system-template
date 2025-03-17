import type { App } from 'vue'

import type { LocaleSetupOptions, SupportedLanguagesType } from '@dag/locales'

import { $t, setupI18n as coreI18n, loadLocalesMapFromDir } from '@dag/locales'
import { preferences } from '@dag/preferences'

const modules = import.meta.glob('./langs/**/*.json')
const localesMap = loadLocalesMapFromDir(/\.\/langs\/([^/]+)\/(.*)\.json$/, modules)

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
        defaultLocale: preferences.app.locale,
        loadMessages,
        missingWarn: !import.meta.env.PROD,
        ...options
    })
}

export { $t, setupI18n }
