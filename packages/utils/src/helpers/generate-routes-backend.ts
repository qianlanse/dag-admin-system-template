import type { RouteRecordRaw } from 'vue-router'

import type {
    ComponentRecordType,
    GenerateMenuAndRoutesOptions,
    RouteRecordStringComponent
} from '@dag-core/typings'

import { mapTree } from '@dag-core/shared/utils'

/**
 * 格式化页面路径
 * @param path
 * @returns 新路劲
 */
function normalizeViewPath(path: string): string {
    // 去除相对路径前缀
    const normalizedPath = path.replace(/^(\.\/|\.\.\/)+/, '')

    const viewPath = normalizedPath.startsWith('/') ? normalizedPath : `/${normalizedPath}`

    return viewPath.replace(/^\/views/, '')
}

/**
 * 转换路由
 * @param routes
 * @param layoutMap
 * @param pageMap
 */
function convertRoutes(
    routes: RouteRecordStringComponent[],
    layoutMap: ComponentRecordType,
    pageMap: ComponentRecordType
): RouteRecordRaw[] {
    return mapTree(routes, (node) => {
        const route = node as unknown as RouteRecordRaw
        const { component, name } = node

        if (!name) {
            console.error('route name is required', route)
        }

        if (component && layoutMap[component]) {
            route.component = layoutMap[component]
        } else if (component) {
            const normalizePath = normalizeViewPath(component)
            const pageKey = normalizePath.endsWith('.vue') ? normalizePath : `${normalizePath}.vue`
            if (pageMap[pageKey]) {
                route.component = pageMap[pageKey]
            } else {
                console.error(`route component is invalid: ${pageKey}`, route)
                route.component = pageMap['/_core/fallback/not-found.vue']
            }
        }

        return route
    })
}

/**
 * 动态生成路由 - 后端方式
 */
async function generateRoutesByBackend(
    options: GenerateMenuAndRoutesOptions
): Promise<RouteRecordRaw[]> {
    const { fetchMenuListAsync, layoutMap = {}, pageMap = {} } = options

    try {
        const menuRoutes = await fetchMenuListAsync?.()
        if (!menuRoutes) {
            return []
        }

        /** 修改成跟后端一致的key */
        const normalizePageMap: ComponentRecordType = {}

        for (const [key, value] of Object.entries(pageMap)) {
            normalizePageMap[normalizeViewPath(key)] = value
        }

        const routes = convertRoutes(menuRoutes, layoutMap, normalizePageMap)

        return routes
    } catch (error) {
        console.error(error)
        throw error
    }
}

export { generateRoutesByBackend }
