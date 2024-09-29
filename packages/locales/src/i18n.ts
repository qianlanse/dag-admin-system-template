import type {
    ImportLocaleFn,
    LoadMessageFn,
    LocaleSetupOptions,
    SupportedLanguagesType
} from './typing'

import { type App, unref } from 'vue'
import { createI18n, type Locale } from 'vue-i18n'

import { useSimpleLocale } from '@dag-core/composables'

const i18n = createI18n({
    globalInjection: true,
    legacy: false,
    locale: '',
    messages: {}
})

const modules = import.meta.glob('./langs/*.json')
const { setSimpleLocale } = useSimpleLocale()

const localesMap = loadLocalesMap(modules)

let loadMessages: LoadMessageFn

/**
 * 加载本地语言数据
 * @param modules
 */
function loadLocalesMap(modules: Record<string, () => Promise<unknown>>) {
    const localesMap: Record<Locale, ImportLocaleFn> = {}

    for (const [path, loadLocale] of Object.entries(modules)) {
        const key = path.match(/([\w-]*)\.(yaml|yml|json)/)?.[1]
        if (key) {
            localesMap[key] = loadLocale as ImportLocaleFn
        }
    }

    return localesMap
}

/**
 * 改变语言
 * @param locale
 */
function setI18nLanguage(locale: Locale) {
    i18n.global.locale.value = locale
    document?.querySelector('html')?.setAttribute('lang', locale)
}

/**
 * 加载语言数据
 * @param lang
 */
async function loadLocaleMessages(lang: SupportedLanguagesType) {
    if (unref(i18n.global.locale) === lang) {
        return setI18nLanguage(lang)
    }
    setSimpleLocale(lang)

    const message = await localesMap[lang]?.()

    if (message?.default) {
        i18n.global.setLocaleMessage(lang, message.default)
    }

    const mergeMessage = await loadMessages(lang)
    i18n.global.mergeLocaleMessage(lang, mergeMessage)

    return setI18nLanguage(lang)
}

/**
 * 初始化语言配置
 * @param app
 * @param options
 */
async function setupI18n(app: App, options: LocaleSetupOptions = {}) {
    const { defaultLocale = 'zh-CN' } = options
    loadMessages = options.loadMessages || (async () => ({}))
    app.use(i18n)
    await loadLocaleMessages(defaultLocale)

    // 未找到数据在控制台打印警告
    i18n.global.setMissingHandler((locale, key) => {
        if (options.missingWarn && key.includes('.')) {
            console.warn(`[intlify] Not found '${key}' key in '${locale}' locale messages.`)
        }
    })
}

const $t = i18n.global.t

export { $t, i18n, loadLocaleMessages, loadLocalesMap, setupI18n }
