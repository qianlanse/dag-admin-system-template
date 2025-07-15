import type { Component } from 'vue'
import type { Router, RouteRecordRaw } from 'vue-router'

interface RouteMeta {
    /**
     * 激活图标 (菜单、Tab)
     */
    activeIcon?: string
    /**
     * 当前激活的菜单，有时候不想激活现有菜单，需要激活父级菜单时使用
     */
    activePath?: string
    /**
     * 是否固定标签页
     */
    affixTab?: boolean
    /**
     * 固定标签页的顺序
     */
    affixTabOrder?: number
    /**
     * 需要特定的角色标识才可以访问
     */
    authority?: string[]
    /**
     * 徽标
     */
    badge?: string
    /**
     * 徽标类型
     */
    badgeType?: 'dot' | 'normal'
    /**
     * 徽标颜色
     */
    badgeVariants?: 'default' | 'destructive' | 'primary' | 'success' | 'warning' | string
    /**
     * 当前路由的子级在菜单中不展示
     */
    hideChildrenInMenu?: boolean
    /**
     * 当前路由在面包屑中不展示
     */
    hideInBreadcrumb?: boolean
    /**
     * 当前路由在菜单中不展示
     */
    hideInMenu?: boolean
    /**
     * 当前路由在标签页不展示
     * @default false
     */
    hideInTab?: boolean
    /**
     * 图标 (菜单、Tab)
     */
    icon?: Component | string
    /**
     * iframe 地址
     */
    iframeSrc?: string
    /**
     * 忽略权限，直接可以访问
     */
    ignoreAccess?: boolean
    /**
     * 开启KeepAlive缓存
     */
    keepAlive?: boolean
    /**
     * 外链-跳转路径
     */
    link?: string
    /**
     * 路由是否已经加载过
     */
    loaded?: boolean
    /**
     * 标签页打开最大数量
     * @default -1
     */
    maxNumOfOpenTab?: number
    /**
     * 菜单可以看到，但是访问会被重定向到403
     */
    menuVisibleWithForbidden?: boolean
    /**
     * 在新窗口打开
     */
    openInNewWindow?: boolean
    /**
     * 路由->菜单排序
     */
    order?: number
    /**
     * 菜单所携带的参数
     */
    query?: Recordable
    /**
     * 标题名称
     */
    title: string
}

/** 定义递归类型以将 RouteRecordRaw 的 component 属性更改为 string */
type RouteRecordStringComponent<T = string> = Omit<RouteRecordRaw, 'children' | 'component'> & {
    children?: RouteRecordStringComponent<T>[]
    component: T
}

type ComponentRecordType = Record<string, () => Promise<Component>>

/** 生成菜单和路由参数 */
interface GenerateMenuAndRoutesOptions {
    /** 获取菜单 */
    fetchMenuListAsync?: () => Promise<RouteRecordStringComponent[]>
    /** 禁止访问页面 */
    forbiddenComponent?: RouteRecordRaw['component']
    /** 布局集合 */
    layoutMap?: ComponentRecordType
    /** 页面集合 */
    pageMap?: ComponentRecordType
    /** 角色 */
    roles?: string[]
    /** 路由 */
    router: Router
    /** 路由集 */
    routes: RouteRecordRaw[]
}

export type {
    ComponentRecordType,
    GenerateMenuAndRoutesOptions,
    RouteMeta,
    RouteRecordRaw,
    RouteRecordStringComponent
}
