import type { Recordable, UserInfo } from '@dag/types'

import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { LOGIN_PATH } from '@dag/constants'
import { preferences } from '@dag/preferences'
import { resetAllStores, useAccessStore, useUserStore } from '@dag/stores'

import { defineStore } from 'pinia'

import { getAccessCodesApi, getUserInfoApi, loginApi, logoutApi } from '#/api'

export const useAuthStore = defineStore('auth', () => {
    const accessStore = useAccessStore()
    const userStore = useUserStore()
    const router = useRouter()

    const loginLoading = ref(false)

    /** 处理登录操作 */
    async function authLogin(params: Recordable<any>, onSuccess?: () => Promise<void> | void) {
        let userInfo: null | UserInfo = null

        try {
            loginLoading.value = true
            const { accessToken } = await loginApi(params)
            // 成功获取到Token
            if (accessToken) {
                // 将accessToken储存到accessStore中
                accessStore.setAccessToken(accessToken)

                // 获取用户信息并储存到accessStore中
                const [userInfoResult, accessCodes] = await Promise.all([
                    fetchUserInfo(),
                    getAccessCodesApi()
                ])

                userInfo = userInfoResult

                userStore.setUserInfo(userInfo)
                accessStore.setAccessCodes(accessCodes)

                if (accessStore.loginExpired) {
                    accessStore.setLoginExpired(false)
                } else {
                    onSuccess
                        ? await onSuccess?.()
                        : await router.push(userInfo.homePath || preferences.app.defaultHomePath)
                }

                if (userInfo?.realName) {
                    // -
                }
            }
        } finally {
            loginLoading.value = false
        }

        return {
            userInfo
        }
    }

    /** 登出 */
    async function logout(redirect: boolean = true) {
        try {
            await logoutApi()
        } catch {
            // -
        }
        resetAllStores()
        accessStore.setLoginExpired(false)

        // 回登录页带上当前路由地址
        await router.replace({
            path: LOGIN_PATH,
            query: redirect
                ? {
                      redirect: encodeURIComponent(router.currentRoute.value.fullPath)
                  }
                : {}
        })
    }

    /** 获取用户信息 */
    async function fetchUserInfo() {
        let userInfo: null | UserInfo = null
        userInfo = await getUserInfoApi()
        userStore.setUserInfo(userInfo)
        return userInfo
    }

    /** 重新定义重置 */
    function $reset() {
        loginLoading.value = false
    }

    return { loginLoading, fetchUserInfo, authLogin, logout, $reset }
})
