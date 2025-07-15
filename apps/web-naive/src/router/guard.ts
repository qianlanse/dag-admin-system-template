import type { Router } from 'vue-router'

import { LOGIN_PATH } from '@dag/constants'
import { preferences } from '@dag/preferences'
import { useAccessStore, useUserStore } from '@dag/stores'
import { startProgress, stopProgress } from '@dag/utils'

import { accessRoutes, coreRouteNames } from '#/router/routes'
import { useAuthStore } from '#/store'

import { generateAccess } from './access'

/**
 * 通用守卫配置
 * @param router
 */
function setupCommonGuard(router: Router) {
    // 记录已经加载的页面
    const loadedPaths = new Set<string>()

    router.beforeEach(async (to) => {
        to.meta.loaded = loadedPaths.has(to.path)

        // 页面加载进度条
        if (!to.meta.loaded && preferences.transition.progress) {
            startProgress()
        }

        return true
    })

    router.afterEach((to) => {
        // 记录页面是否已经加载，后续的页面切换动画等效果不在重复执行
        loadedPaths.add(to.path)

        // 关闭页面加载进度条
        if (preferences.transition.progress) {
            stopProgress()
        }
    })
}

/**
 * 权限守卫配置
 * @param router
 */
function setupAccessGuard(router: Router) {
    router.beforeEach(async (to, form) => {
        const accessStore = useAccessStore()
        const userStore = useUserStore()
        /** 用户登录，登出，获取用户信息等操作 */
        const authStore = useAuthStore()

        // 基本路由，这些路由不需要进去权限拦截
        if (coreRouteNames.includes(to.name as string)) {
            if (to.path === LOGIN_PATH && accessStore.accessToken) {
                return decodeURIComponent(
                    (to.query?.redirect as string) ||
                        userStore.userInfo?.homePath ||
                        preferences.app.defaultHomePath
                )
            }
            return true
        }

        // 检查未登录时
        if (!accessStore.accessToken) {
            if (to.meta.ignoreAccess) {
                return true
            }

            // 如果不是登录页面则跳转到登录页面
            if (to.fullPath !== LOGIN_PATH) {
                return {
                    path: LOGIN_PATH,
                    // 参数(不需要可删除)
                    query:
                        to.fullPath === preferences.app.defaultHomePath
                            ? {}
                            : { redirect: encodeURIComponent(to.fullPath) },
                    replace: true
                }
            }

            return to
        }

        // 检查是否已经生成动态路由
        if (accessStore.isAccessChecked) {
            return true
        }

        // 生成路由表，当前登录用户拥有的角色标识
        const userInfo = userStore.userInfo || (await authStore.fetchUserInfo())
        const userRoles = userInfo.roles ?? []

        // 生成菜单和路由
        const { accessibleMenus, accessibleRoutes } = await generateAccess({
            roles: userRoles,
            router,
            routes: accessRoutes
        })

        accessStore.setAccessMenus(accessibleMenus)
        accessStore.setAccessRoutes(accessibleRoutes)
        accessStore.setIsAccessChecked(true)

        const redirectPath = (form.query.redirect ??
            (to.path === preferences.app.defaultHomePath
                ? userInfo.homePath || preferences.app.defaultHomePath
                : to.fullPath)) as string

        return {
            ...router.resolve(decodeURIComponent(redirectPath)),
            replace: true
        }
    })
}

/**
 * 配置路由守卫
 * @param router
 */
function createRouterGuard(router: Router) {
    /** 通用 */
    setupCommonGuard(router)

    /** 权限 */
    setupAccessGuard(router)
}

export { createRouterGuard }
