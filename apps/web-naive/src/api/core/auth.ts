import { requestClient } from '../request'

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
}

/** 登录 */
export async function loginApi(data: AuthApi.LoginParams) {
    return requestClient.post<AuthApi.LoginResult>('/auth/login', data)
}

/** 获取用户权限码 */
export async function getAccessCodesApi() {
    return requestClient.get<string[]>('/auth/codes')
}
