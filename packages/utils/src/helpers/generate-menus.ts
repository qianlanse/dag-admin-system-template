import type { Router, RouteRecordRaw } from 'vue-router'

import type { ExRouteRecordRaw, MenuRecordRaw } from '@dag-core/typings'

import { filterTree, mapTree } from '@dag-core/shared/utils'

/**
 * 根据routes生成菜单列表
 * @param routes
 * @param router
 */
async function generateMenus(routes: RouteRecordRaw[], router: Router): Promise<MenuRecordRaw[]> {
    const finalRoutesMap: { [key: string]: string } = Object.fromEntries(
        router.getRoutes().map(({ name, path }) => [name, path])
    )

    let menus = mapTree<ExRouteRecordRaw, MenuRecordRaw>(routes, (route) => {
        const path = finalRoutesMap[route.name as string] ?? route.path

        const { meta, name: routeName, redirect, children } = route
        const {
            activeIcon,
            badge,
            badgeType,
            badgeVariants,
            hideChildrenInMenu = false,
            icon,
            link,
            order,
            title = ''
        } = meta || {}

        const name = (title || routeName || '') as string
        const resultChildren = hideChildrenInMenu ? [] : (children as MenuRecordRaw[])

        if (resultChildren && resultChildren.length > 0) {
            resultChildren.forEach((child) => {
                child.parents = [...(route.parents || []), path]
                child.parent = path
            })
        }

        const resultPath = hideChildrenInMenu ? redirect || path : link || path

        return {
            activeIcon,
            badge,
            badgeType,
            badgeVariants,
            icon,
            name,
            order,
            parent: route.parent,
            parents: route.parents,
            path: resultPath as string,
            show: !route?.meta?.hideInMenu,
            children: resultChildren || []
        }
    })

    menus = menus.sort((a, b) => (a?.order ?? 999) - (b?.order ?? 999))

    const finalMenus = filterTree(menus, (menu) => {
        return !!menu.show
    })

    return finalMenus
}

export { generateMenus }
