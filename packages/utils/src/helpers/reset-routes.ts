import type { Router, RouteRecordName, RouteRecordRaw } from 'vue-router'

import { traverseTreeValues } from '@dag-core/shared/utils'

/**
 * 重置所有路由，如有指定白名单除外
 * @param router 路由实例
 * @param routes 路由集合
 */
export function resetStaticRoutes(router: Router, routes: RouteRecordRaw[]) {
    const staticRouteNames = traverseTreeValues<RouteRecordRaw, RouteRecordName | undefined>(
        routes,
        (route) => {
            if (!route.name) {
                console.warn(
                    `The route with the path ${route.path} needs to have the field name specified.`
                )
            }

            return route.name
        }
    )

    // eslint-disable-next-line no-console
    console.log('staticRouteNames:', staticRouteNames)

    const { getRoutes, hasRoute, removeRoute } = router
    const allRoutes = getRoutes()

    allRoutes.forEach(({ name }) => {
        if (name && !staticRouteNames.includes(name) && hasRoute(name)) {
            removeRoute(name)
        }
    })
}
