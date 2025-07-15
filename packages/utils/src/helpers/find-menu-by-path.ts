import type { MenuRecordRaw } from '@dag-core/typings'

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
 * @param menus
 * @param path
 * @param level
 */
function findRootMenuByPath(menus: MenuRecordRaw[], path?: string, level = 0) {
    const findMenu = findMenuByPath(menus, path)
    const rootMenuPath = findMenu?.parent?.[level]
    const rootMenu = rootMenuPath ? menus.find((item) => item.path === rootMenuPath) : undefined

    return {
        findMenu,
        rootMenu,
        rootMenuPath
    }
}

export { findRootMenuByPath }
