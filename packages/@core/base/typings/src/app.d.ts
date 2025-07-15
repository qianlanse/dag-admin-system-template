/** 主题色 */
type ThemeModeType = 'auto' | 'dark' | 'light'

/** 登录过期模式(弹窗或页面) */
type LoginExpiredModeType = 'modal' | 'page'

/** 面包屑样式(背景或默认) */
type BreadcrumbStyleType = 'background' | 'normal'

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
 * mixed 混合权限模式
 */
type AccessModeType = 'backend' | 'frontend' | 'mixed'

/** 特免切换动画 */
type PageTransitionType = 'fade' | 'fade-down' | 'fade-slide' | 'fade-up'

/** 导航风格 朴素｜圆润 */
type NavigationStyleType = 'plain' | 'rounded'

/** 标签栏风格 轻快｜卡片｜谷歌｜朴素 */
type TabsStyleType = 'brisk' | 'card' | 'chrome' | 'plain'

/** 内容区域定宽 */
type ContentCompactType = 'compact' | 'wide'

/** header显示模式 */
type LayoutHeaderModeType = 'auto' | 'auto-scroll' | 'fixed' | 'static'

/** 顶栏菜单位置 */
type LayoutHeaderMenuAlignType = 'center' | 'end' | 'start'

/**
 * 偏好设置按钮位置
 * fixed 固定在右侧
 * header 顶栏
 * auto 自动
 */
type PreferencesButtonPositionType = 'auto' | 'fixed' | 'header'

/**
 * 布局方式
 * sidebar-nav 侧边菜单布局
 * header-nav 顶部菜单布局
 * mixed-nav 侧边&顶部菜单布局
 * sidebar-mixed-nav 侧边混合菜单布局
 * full-content 全屏内容布局
 */
type LayoutType =
    | 'full-content'
    | 'header-mixed-nav'
    | 'header-nav'
    | 'header-sidebar-nav'
    | 'mixed-nav'
    | 'sidebar-mixed-nav'
    | 'sidebar-nav'

export type {
    AccessModeType,
    AuthPageLayoutType,
    BreadcrumbStyleType,
    BuiltinThemeType,
    ContentCompactType,
    LayoutHeaderMenuAlignType,
    LayoutHeaderModeType,
    LayoutType,
    LoginExpiredModeType,
    NavigationStyleType,
    PageTransitionType,
    PreferencesButtonPositionType,
    TabsStyleType,
    ThemeModeType
}
