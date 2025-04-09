import type { EventHandlerRequest, H3Event } from 'h3'

export function setRefreshTokenCookie(event: H3Event<EventHandlerRequest>, refreshToken: string) {
    setCookie(event, 'jwt', refreshToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60,
        sameSite: 'none',
        secure: true
    })
}
