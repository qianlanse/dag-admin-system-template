import type { RouteRecordRaw } from 'vue-router'

import { mergeRouteModules, traverseTreeValues } from '@dag/utils'

import { coreRoutes, fallbackNotFoundRoute } from './core'

const dynamicRouteFiles = import.meta.glob('./modules/**/*.ts', {
    eager: true
})

const externalRouteFiles = import.meta.glob('./external/**/*.ts', {
    eager: true
})

/** 动态路由 */
const dynamicRoutes: RouteRecordRaw[] = mergeRouteModules(dynamicRouteFiles)

/** 扩展路由 */
const externalRoutes: RouteRecordRaw[] = mergeRouteModules(externalRouteFiles)

/**
 * 路由列表，由基本路由、扩展路由和404兜底路由组成
 * 无需走权限验证（会一直显示在菜单中）
 */
const routes: RouteRecordRaw[] = [...coreRoutes, ...externalRoutes, fallbackNotFoundRoute]

/** 基本路由列表，这些路由不需要进入权限拦截 */
const coreRouteNames = traverseTreeValues(coreRoutes, (route) => route.name)

const accessRoutes = [...dynamicRoutes]

export { accessRoutes, coreRouteNames, routes }
