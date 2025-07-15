import type { RequestClientOptions } from '@dag/request'

import { useAppConfig } from '@dag/hooks'
import { preferences } from '@dag/preferences'
import {
    authenticateResponseInterceptor,
    defaultResponseInterceptor,
    RequestClient
} from '@dag/request'
import { useAccessStore } from '@dag/stores'

import { useAuthStore } from '#/store'

import { refreshTokenApi } from './core'

const { apiURL } = useAppConfig(import.meta.env, import.meta.env.PROD)

function createRequestClient(baseURL: string, options?: RequestClientOptions) {
    const client = new RequestClient({
        ...options,
        baseURL
    })

    function formatToken(token: null | string) {
        return token ? `Bearer ${token}` : null
    }

    /** 重新认证逻辑 */
    async function doReAuthenticate() {
        console.warn('token 过期')
        const accessStore = useAccessStore()
        const authStore = useAuthStore()
        accessStore.setAccessToken(null)

        if (preferences.app.loginExpiredMode === 'modal' && accessStore.isAccessChecked) {
            accessStore.setLoginExpired(true)
        } else {
            await authStore.logout()
        }
    }

    /** 刷新token逻辑 */
    async function doRefreshToken() {
        const accessStore = useAccessStore()
        const resp = await refreshTokenApi()
        const newToken = resp.data
        accessStore.setAccessToken(newToken)

        return newToken
    }

    /** 请求头处理 */
    client.addRequestInterceptor({
        fulfilled: async (config) => {
            const accessStore = useAccessStore()

            config.headers.Authorization = formatToken(accessStore.accessToken)
            config.headers['Accept-Language'] = preferences.app.locale
            return config
        }
    })

    /** 处理成功请求结果 */
    client.addResponseInterceptor(
        defaultResponseInterceptor({
            codeField: 'code',
            dataField: 'data',
            successCode: 0
        })
    )

    /** token过期的处理 */
    client.addResponseInterceptor(
        authenticateResponseInterceptor({
            client,
            doReAuthenticate,
            doRefreshToken,
            enableRefreshToken: preferences.app.enableRefreshToken,
            formatToken
        })
    )

    return client
}

export const requestClient = createRequestClient(apiURL, {
    responseReturn: 'data'
})

export const baseRequestClient = new RequestClient({ baseURL: apiURL })
