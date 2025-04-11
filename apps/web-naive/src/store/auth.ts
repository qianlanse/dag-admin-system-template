import type { Recordable, UserInfo } from '@dag/types'

import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { DEFAULT_HOME_PATH } from '@dag/constants'
import { useAccessStore, useUserStore } from '@dag/stores'

import { defineStore } from 'pinia'

import { getAccessCodesApi, getUserInfoApi, loginApi } from '#/api'

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
                        : await router.push(userInfo.homePath || DEFAULT_HOME_PATH)
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

    /** 获取用户信息 */
    async function fetchUserInfo() {
        let userInfo: null | UserInfo = null
        userInfo = await getUserInfoApi()
        userStore.setUserInfo(userInfo)
        return userInfo
    }

    return { loginLoading, fetchUserInfo, authLogin }
})
