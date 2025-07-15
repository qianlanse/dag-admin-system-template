import type { EventHandlerRequest, H3Event } from 'h3'

export function clearRefreshTokenCookie(event: H3Event<EventHandlerRequest>) {
    deleteCookie(event, 'jwt', {
        httpOnly: true,
        sameSite: 'none',
        secure: true
    })
}

export function setRefreshTokenCookie(event: H3Event<EventHandlerRequest>, refreshToken: string) {
    setCookie(event, 'jwt', refreshToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60,
        sameSite: 'none',
        secure: true
    })
}

export function getRefreshTokenFromCookie(event: H3Event<EventHandlerRequest>) {
    const refreshToekn = getCookie(event, 'jwt')
    return refreshToekn
}
