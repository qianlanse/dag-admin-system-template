import type {
    AccessModeType,
    AuthPageLayoutType,
    BuiltinThemeType,
    DeepPartial,
    PageTransitionType,
    ThemeModeType
} from '@dag-core/typings'

type SupportedLanguagesType = 'en-US' | 'zh-CN'

interface ThemePreferences {
    // 内置主题名
    builtinType: BuiltinThemeType
    // 错误色
    colorDestructive: string
    // 主题色
    colorPrimary: string
    // 成功色
    colorSuccess: string
    // 警告色
    colorWarning: string
    // 当前主题
    mode: ThemeModeType
    // 圆角
    radius: string
    // 是否开启半深色header（只在theme='light'时生效）
    semiDarkHeader: boolean
    // 是否开启半深色菜单（只在theme='light'时生效）
    semiDarkSidebar: boolean
}

interface AppPreferences {
    /** 权限模式 */
    accessMode: AccessModeType
    /** 登录注册页面布局 */
    authPageLayout: AuthPageLayoutType
    /** 开启动态标题 */
    dynamicTitle: boolean
    /** 支持的语言 */
    locale: SupportedLanguagesType
    /** 应用名 */
    name: string
}

interface LogoPreferences {
    // 是否可见
    enable: boolean
    // logo地址
    source: string
}

interface CopyrightPreferences {
    // 版权公司名
    companyName: string
    // 版权公司链接
    companySiteLink: string
    // 版权日期
    date: string
    // 版权是否可见
    enable: boolean
    // 备案号
    icp: string
    // 备案号链接
    icpLink: string
    // 设置面板是否显示
    settingShow?: boolean
}

interface TransitionPreferences {
    /** 页面切换动画是否启用 */
    enable: boolean
    /** 是否开启页面加载loading */
    loading: boolean
    /** 页面切换动画 */
    name: PageTransitionType | string
    /** 是否开启页面加载进度动画 */
    progress: boolean
}

interface Preferences {
    /** 全局配置 */
    app: AppPreferences
    /** 版权配置 */
    copyright: CopyrightPreferences
    /** logo配置 */
    logo: LogoPreferences
    /** 主题配置 */
    theme: ThemePreferences
    /** 动画配置 */
    transition: TransitionPreferences
}

interface InitialOptions {
    namespace: string
    overrides?: DeepPartial<Preferences>
}

export type {
    CopyrightPreferences,
    InitialOptions,
    LogoPreferences,
    Preferences,
    SupportedLanguagesType,
    ThemePreferences
}
