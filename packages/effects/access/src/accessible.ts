import type { Component, DefineComponent } from 'vue'

import type { AccessModeType, GenerateMenuAndRoutesOptions, RouteRecordRaw } from '@dag/types'

import { defineComponent, h } from 'vue'

import {
    cloneDeep,
    generateMenus,
    generateRoutesByBackend,
    generateRoutesByFrontend,
    isFunction,
    isString,
    mapTree
} from '@dag/utils'

/**
 * 生成路由
 * @param mode 权限模式
 * @param options 生成菜单和路由参数
 */
async function generateRoutes(mode: AccessModeType, options: GenerateMenuAndRoutesOptions) {
    const { forbiddenComponent, roles, routes } = options

    let resultRoutes: RouteRecordRaw[] = routes
    switch (mode) {
        case 'backend': {
            resultRoutes = await generateRoutesByBackend(options)
            break
        }
        case 'frontend': {
            resultRoutes = await generateRoutesByFrontend(routes, roles || [], forbiddenComponent)
            break
        }
    }

    resultRoutes = mapTree(resultRoutes, (route) => {
        // 重新包装component，使用与路由名称相同的name以支持keep-alive的条件缓存
        if (
            route.meta?.keepAlive &&
            isFunction(route.component) &&
            route.name &&
            isString(route.name)
        ) {
            const originalComponent = route.component as () => Promise<{
                default: Component | DefineComponent
            }>
            route.component = async () => {
                const component = await originalComponent()
                if (!component.default) return component
                return defineComponent({
                    name: route.name as string,
                    setup(props, { attrs, slots }) {
                        return () => h(component.default, { ...props, ...attrs }, slots)
                    }
                })
            }
        }

        // 如果有redirect或者没有子路由，则直接返回
        if (route.redirect || !route.children || route.children.length === 0) {
            return route
        }

        const firstChild = route.children[0]

        // 如果子路由不是以/开头，则直接返回
        if (!firstChild?.path || !firstChild.path.startsWith('/')) {
            return route
        }

        route.redirect = firstChild.path

        return route
    })

    return resultRoutes
}

/**
 *
 * @param mode 权限模式
 * @param options
 */
async function generateAccessible(mode: AccessModeType, options: GenerateMenuAndRoutesOptions) {
    const { router } = options

    options.routes = cloneDeep(options.routes)

    // 生成路由
    const accessibleRoutes = await generateRoutes(mode, options)
    const root = router.getRoutes().find((item) => item.path === '/')
    const names = root?.children?.map((item) => item.name) ?? []

    accessibleRoutes.forEach((route) => {
        if (root && !route.meta?.noBasicLayout) {
            if (route.children && route.children.length > 0) {
                delete route.component
            }

            if (!names?.includes(route.name)) {
                root.children?.push(route)
            }
        } else {
            router.addRoute(route)
        }
    })

    if (root) {
        if (root.name) {
            router.removeRoute(root.name)
        }
        router.addRoute(root)
    }

    const accessibleMenus = await generateMenus(accessibleRoutes, options.router)

    return { accessibleMenus, accessibleRoutes }
}

export { generateAccessible }
