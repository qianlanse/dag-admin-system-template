import { baseRequestClient, requestClient } from '../request'

export namespace AuthApi {
    /** 登录接口参数 */
    export interface LoginParams {
        username?: string
        password?: string
    }

    /** 登录成功返回参数 */
    export interface LoginResult {
        accessToken: string
    }

    /** 刷新accessToken返回参数 */
    export interface RefreshTokenResult {
        data: string
        status: number
    }
}

/** 登录 */
export async function loginApi(data: AuthApi.LoginParams) {
    return requestClient.post<AuthApi.LoginResult>('/auth/login', data)
}

/** 刷新accessToken */
export async function refreshTokenApi() {
    return baseRequestClient.post<AuthApi.RefreshTokenResult>('/auth/refresh', {
        withCredentials: true
    })
}

/** 退出登录 */
export async function logoutApi() {
    return baseRequestClient.post('/auth/logout', {
        withCredentials: true
    })
}

/** 获取用户权限码 */
export async function getAccessCodesApi() {
    return requestClient.get<string[]>('/auth/codes')
}
