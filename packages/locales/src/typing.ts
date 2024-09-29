export type SupportedLanguagesType = 'en-US' | 'zh-CN'

export type ImportLocaleFn = () => Promise<{ default: Record<string, string> }>

export type LoadMessageFn = (
    lang: SupportedLanguagesType
) => Promise<Record<string, string> | undefined>

export interface LocaleSetupOptions {
    /**
     * 默认语言
     * @default zh-CN
     */
    defaultLocale?: SupportedLanguagesType
    /**
     * 加载语言数据函数
     * @param lang
     * @returns
     */
    loadMessages?: LoadMessageFn
    /**
     * 未找到密钥时是否发出警告
     */
    missingWarn?: boolean
}
