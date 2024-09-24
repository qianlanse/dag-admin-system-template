import type { RouteRecordRaw } from 'vue-router'

/**
 * 扩展路由原始对象
 */
type ExRouteRecordRaw = {
    parent?: string
    parents?: string[]
    path?: any
} & RouteRecordRaw

export type { ExRouteRecordRaw }
