/**
 * 登录页面url地址
 */
export const LOGIN_PATH = '/auth/login'

export interface LanguageOption {
    label: string
    value: 'en-US' | 'zh-CN'
}

/**
 * 支持的语言
 */
export const SUPPORT_LANGUAGES: LanguageOption[] = [
    {
        label: '简体中文',
        value: 'zh-CN'
    },
    {
        label: 'English',
        value: 'en-US'
    }
]
