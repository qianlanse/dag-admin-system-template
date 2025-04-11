/** 主题色 */
type ThemeModeType = 'auto' | 'dark' | 'light'

/** 内置主题名 */
type BuiltinThemeType =
    | 'custom'
    | 'deep-blue'
    | 'deep-green'
    | 'default'
    | 'gray'
    | 'green'
    | 'neutral'
    | 'orange'
    | 'pink'
    | 'red'
    | 'rose'
    | 'sky-blue'
    | 'slate'
    | 'stone'
    | 'violet'
    | 'yellow'
    | 'zinc'
    | (Record<never, never> & string)

/** 页面布局 */
type AuthPageLayoutType = 'panel-center' | 'panel-left' | 'panel-right'

/**
 * 权限模式
 * backend 后端权限模式
 * frontend 前端权限模式
 */
type AccessModeType = 'backend' | 'frontend'

/** 特免切换动画 */
type PageTransitionType = 'fade' | 'fade-down' | 'fade-slide' | 'fade-up'

export type {
    AccessModeType,
    AuthPageLayoutType,
    BuiltinThemeType,
    PageTransitionType,
    ThemeModeType
}
