import type { MenuProvider, SubMenuProvider } from '../types'

import { getCurrentInstance, inject, provide } from 'vue'

import { findComponentUpward } from '../utils'

const menuContextKey = Symbol('menuContext')

/** 提供菜单上下文 */
function createMenuContext(injectMenuData: MenuProvider) {
    provide(menuContextKey, injectMenuData)
}

/** 提供子菜单上下文 */
function createSubMenuContext(injectSubMenuData: SubMenuProvider) {
    const instance = getCurrentInstance()
    provide(`subMenu:${instance?.uid}`, injectSubMenuData)
}

/** 注入菜单上下文 */
function useMenuContext() {
    const instance = getCurrentInstance()
    if (!instance) {
        throw new Error('Instance is required')
    }

    const rootMenu = inject(menuContextKey) as MenuProvider
    return rootMenu
}

/** 注入子菜单上下文 */
function useSubMenuContext() {
    const instance = getCurrentInstance()
    if (!instance) {
        throw new Error('Instance is required')
    }

    const parentMenu = findComponentUpward(instance, ['Menu', 'SubMenu'])
    const subMenu = inject(`subMenu:${parentMenu?.uid}`) as SubMenuProvider
    return subMenu
}

export { createMenuContext, createSubMenuContext, useMenuContext, useSubMenuContext }
