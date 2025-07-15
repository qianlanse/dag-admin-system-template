import type { Component, Ref } from 'vue'

import type { MenuRecordBadgeRaw, ThemeModeType } from '@dag-core/typings'

interface MenuProps {
    /** 是否开启手风琴模式 */
    accordion?: boolean
    /** 菜单是否折叠 */
    collapse?: boolean
    /** 菜单折叠时是否显示菜单名称 */
    collapseShowTitle?: boolean
    /** 默认激活的菜单 */
    defaultActive?: string
    /** 默认展开的菜单 */
    defaultOpeneds?: string[]
    /** 菜单模式 */
    mode?: 'horizontal' | 'vertical'
    /** 是否圆润风格 */
    rounded?: boolean
    /** 是否自动滚动到激活的菜单项 */
    scrollToActive?: boolean
    /** 菜单主题 */
    theme?: ThemeModeType
}

interface SubMenuProps extends MenuRecordBadgeRaw {
    /** 激活图标 */
    activeIcon?: string
    /** 是否禁用 */
    disabled?: boolean
    /** 图标 */
    icon?: Component | string
    /** submenu名称 */
    path: string
}

interface MenuItemProps extends MenuRecordBadgeRaw {
    /** 激活图标 */
    activeIcon?: string
    /** 是否禁用 */
    disabled?: boolean
    /** 图标 */
    icon?: Component | string
    /** 路径 */
    path: string
}

interface MenuItemRegistered {
    active: boolean
    parentPaths: string[]
    path: string
}

interface MenuItemClicked {
    parentPaths: string[]
    path: string
}

interface MenuProvider {
    activePath?: string
    addMenuItem: (item: MenuItemRegistered) => void
    addSubMenu: (item: MenuItemRegistered) => void
    closeMenu: (path: string, parentLinks: string[]) => void
    handleMenuItemClick: (item: MenuItemClicked) => void
    handleSubMenuClick: (subMenu: MenuItemRegistered) => void
    isMenuPopup: boolean
    items: Record<string, MenuItemRegistered>
    openedMenus: string[]
    openMenu: (path: string, parentLinks: string[]) => void
    props: MenuProps
    removeMenuItem: (item: MenuItemRegistered) => void
    removeSubMenu: (item: MenuItemRegistered) => void
    subMenus: Record<string, MenuItemRegistered>
    theme: string
}

interface SubMenuProvider {
    addSubMenu: (item: MenuItemRegistered) => void
    handleMouseleave?: (deepDispatch: boolean) => void
    level: number
    mouseInChild: Ref<boolean>
    removeSubMenu: (item: MenuItemRegistered) => void
}

export type {
    MenuItemClicked,
    MenuItemProps,
    MenuItemRegistered,
    MenuProps,
    MenuProvider,
    SubMenuProps,
    SubMenuProvider
}
