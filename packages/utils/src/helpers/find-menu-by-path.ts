import type { MenuRecordRaw } from '@dag-core/typings'

/**
 * 更具当前路由地址获取菜单路径
 * @param menus - 菜单地址
 * @param path - 当前页面地址
 */
function findMenuByPath(menus: MenuRecordRaw[], path?: string): MenuRecordRaw | null {
    for (const menu of menus) {
        if (menu.path === path) {
            return menu
        }
        const findMenu = menu.children && findMenuByPath(menu.children, path)
        if (findMenu) {
            return findMenu
        }
    }
    return null
}

/**
 * 查找根菜单
 * @param menus - 菜单地址
 * @param path - 当前页面地址
 * @param level - 查找层级
 */
function findRootMenuByPath(menus: MenuRecordRaw[], path?: string, level = 0) {
    const findMenu = findMenuByPath(menus, path)
    const rootMenuPath = findMenu?.parents?.[level]
    const rootMenu = rootMenuPath ? menus.find((item) => item.path === rootMenuPath) : undefined

    return {
        findMenu,
        rootMenu,
        rootMenuPath
    }
}

export { findMenuByPath, findRootMenuByPath }
