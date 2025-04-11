import type { RouteRecordRaw } from 'vue-router'

import { filterTree, mapTree } from '@dag-core/shared/utils'

/**
 * 判断路由是否在菜单中显示，但是访问会被重定向到403
 * @param route
 */
function menuHasVisibleWithForbidden(route: RouteRecordRaw) {
    return (
        !!route.meta?.authority &&
        Reflect.has(route.meta || {}, 'menuVisibleWithForbidden') &&
        !!route.meta?.menuVisibleWithForbidden
    )
}

/**
 * 判断路由是否有权限访问
 * @param route
 * @param access
 */
function hasAuthority(route: RouteRecordRaw, access: string[]) {
    const authority = route.meta?.authority
    if (!authority) {
        return true
    }

    const canAccess = access.some((value) => authority.includes(value))

    return canAccess || (!canAccess && menuHasVisibleWithForbidden(route))
}

/**
 * 动态生成路由 - 前端方式
 * @param routes
 * @param roles
 * @param forbiddenComponent
 */
async function generateRoutesByFrontend(
    routes: RouteRecordRaw[],
    roles: string[],
    forbiddenComponent?: RouteRecordRaw['component']
): Promise<RouteRecordRaw[]> {
    const finalRoutes = filterTree(routes, (route) => {
        return hasAuthority(route, roles)
    })

    if (!forbiddenComponent) {
        return finalRoutes
    }

    return mapTree(finalRoutes, (route) => {
        if (menuHasVisibleWithForbidden(route)) {
            route.component = forbiddenComponent
        }
        return route
    })
}

export { generateRoutesByFrontend }
