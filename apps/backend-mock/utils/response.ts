import type { EventHandlerRequest, H3Event } from 'h3'

/** 错误响应值 */
export function useResponseError(message: string, error: any = null) {
    return {
        code: -1,
        data: null,
        error,
        message
    }
}

/** 禁止响应 */
export function forbiddenResponse(
    event: H3Event<EventHandlerRequest>,
    message = 'Forbidden Exception'
) {
    setResponseStatus(event, 403)
    return useResponseError(message, message)
}

/** 无权限响应 */
export function unAuthorizedResponse(event: H3Event<EventHandlerRequest>) {
    setResponseStatus(event, 401)
    return useResponseError('Unauthorized Exception', 'Unauthorized Exception')
}

export function useResponseSuccess<T = any>(data: T) {
    return {
        code: 0,
        data,
        error: null,
        message: 'ok'
    }
}
