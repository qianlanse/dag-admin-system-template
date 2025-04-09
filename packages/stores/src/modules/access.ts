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
        setAccessCodes(codes: string[]) {
            this.accessCodes = codes
        },
        setAccessToken(token: AccessToken) {
            this.accessToken = token
        },
        setLoginExpired(loginExpired: boolean) {
            this.loginExpired = loginExpired
        }
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
