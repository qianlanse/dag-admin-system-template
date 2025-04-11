import type { RouteRecordRaw } from 'vue-router'

import type { MenuRecordRaw } from '@dag-core/typings'

import { acceptHMRUpdate, defineStore } from 'pinia'

type AccessToken = null | string

interface AccessState {
    /** 权限码 */
    accessCodes: string[]
    /** 可访问的菜单列表 */
    accessMenus: MenuRecordRaw[]
    /** 可访问的路由列表 */
    accessRoutes: RouteRecordRaw[]
    /** 登录accessToken */
    accessToken: AccessToken
    /** 是否已经检查过权限 */
    isAccessChecked: boolean
    /** 登录是否过期 */
    loginExpired: boolean
    /** 刷新后登录accessToken */
    refreshToken: AccessToken
}

/** 菜单Token设置 */
export const useAccessStore = defineStore('core-access', {
    actions: {
        /** 设置权限码 */
        setAccessCodes(codes: string[]) {
            this.accessCodes = codes
        },
        /** 设置可访问的菜单列表 */
        setAccessMenus(menus: MenuRecordRaw[]) {
            this.accessMenus = menus
        },
        /** 设置可访问的路由列表 */
        setAccessRoutes(routes: RouteRecordRaw[]) {
            this.accessRoutes = routes
        },
        /** 设置AccessToken值 */
        setAccessToken(token: AccessToken) {
            this.accessToken = token
        },
        /** 设置权限是否验证 */
        setIsAccessChecked(isAccessChecked: boolean) {
            this.isAccessChecked = isAccessChecked
        },
        /** 设置登录是否过期 */
        setLoginExpired(loginExpired: boolean) {
            this.loginExpired = loginExpired
        }
    },
    // 持久化
    persist: {
        pick: ['accessToken', 'refreshToken', 'accessCodes']
    },
    state: (): AccessState => ({
        accessCodes: [],
        accessMenus: [],
        accessRoutes: [],
        accessToken: null,
        isAccessChecked: false,
        loginExpired: false,
        refreshToken: null
    })
})

// 热更新
const hot = import.meta.hot
if (hot) {
    hot.accept(acceptHMRUpdate(useAccessStore, hot))
}
