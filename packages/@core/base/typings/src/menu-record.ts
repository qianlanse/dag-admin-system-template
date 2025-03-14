import type { RouteRecordRaw } from 'vue-router'

/**
 * 扩展路由原始对象
 */
type ExRouteRecordRaw = RouteRecordRaw & {
    parent?: string
    parents?: string[]
    path?: any
}

export type { ExRouteRecordRaw }
