import type {
    ContentCompactType,
    LayoutHeaderModeType,
    LayoutType,
    ThemeModeType
} from '@dag-core/typings'

export interface DagLayoutProps {
    /** 内容区域定宽 @default 'wide' */
    contentCompact?: ContentCompactType
    /** 定宽布局宽度 @default 1200 */
    contentCompactWidth?: number
    /** Padding @default 16 */
    contentPadding?: number
    /** PaddingBottom @default 16 */
    contentPaddingBottom?: number
    /** PaddingLeft @default 16 */
    contentPaddingLeft?: number
    /** PaddingRight @default 16 */
    contentPaddingRight?: number
    /** PaddingTop @default 16 */
    contentPaddingTop?: number
    /** 底部是否可见 */
    footerEnable?: boolean
    /** 底部是否固定 */
    footerFixed?: boolean
    /** 底部高度 @default 32 */
    footerHeight?: number
    /** 顶部高度 @default 48 */
    headerHeight?: number
    /** 顶部是否隐藏 */
    headerHidden?: boolean
    /** 顶部显示模式 @default 'fixed' */
    headerMode?: LayoutHeaderModeType
    /** 顶部主题 */
    headerTheme?: ThemeModeType
    /** 是否显示顶部切换侧边栏按钮 */
    headerToggleSidebarButton?: boolean
    /** 顶部是否显示 */
    headerVisible?: boolean
    /** 是否移动端显示 */
    isMobile?: boolean
    /** 布局方式 */
    layout?: LayoutType
    /** 侧边菜单折叠状态 */
    sidebarCollapse?: boolean
    /** 侧边菜单折叠按钮 */
    sidebarCollapsedButton?: boolean
    /** 侧边菜单折叠时是否显示Title */
    sidebarCollapseShowTitle?: boolean
    /** 侧边栏是否可见 */
    sidebarEnable?: boolean
    /** 侧边菜单折叠额外宽度 @default 48 */
    sidebarExtraCollapsedWidth?: number
    /** 侧边菜单这些按钮是否固定 @default true */
    sidebarFixedButton?: boolean
    /** 侧边烂是否隐藏 */
    sidebarHidden?: boolean
    /** 混合侧边栏宽度 */
    sidebarMixedWidth?: number
    /** 侧边栏主题 @default 'dark' */
    sidebarTheme?: ThemeModeType
    /** 侧边栏宽度 @default 210 */
    sidebarWidth?: number
    /** 侧边菜单折叠宽度 @default 48 */
    sideCollapseWidth?: number
    /** Tab是否可见 @default true */
    tabbarEnable?: boolean
    /** Tab高度 @default 30 */
    tabbarHeight?: number
    /** 层级 @default 100 */
    zIndex?: number
}
