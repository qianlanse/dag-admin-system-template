/**
 * 主题色
 */
type ThemeModeType = 'auto' | 'dark' | 'light'

/**
 * 内置主题名
 */
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

export type { BuiltinThemeType, ThemeModeType }
