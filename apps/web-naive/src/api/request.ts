import type { RequestClientOptions } from '@dag/request'

import { useAppConfig } from '@dag/hooks'
import { preferences } from '@dag/preferences'
import { defaultResponseInterceptor, RequestClient } from '@dag/request'
import { useAccessStore } from '@dag/stores'

const { apiURL } = useAppConfig(import.meta.env, import.meta.env.PROD)

function createRequestClient(baseURL: string, options?: RequestClientOptions) {
    const client = new RequestClient({
        ...options,
        baseURL
    })

    function formatToken(token: null | string) {
        return token ? `Bearer ${token}` : null
    }

    // 请求头处理
    client.addRequestInterceptor({
        fulfilled: async (config) => {
            const accessStore = useAccessStore()

            config.headers.Authorization = formatToken(accessStore.accessToken)
            config.headers['Accept-Language'] = preferences.app.locale
            return config
        }
    })

    // 处理成功请求结果
    client.addResponseInterceptor(
        defaultResponseInterceptor({
            codeField: 'code',
            dataField: 'data',
            successCode: 0
        })
    )

    return client
}

export const requestClient = createRequestClient(apiURL, {
    responseReturn: 'data'
})

export const baseRequestClient = new RequestClient({ baseURL: apiURL })
