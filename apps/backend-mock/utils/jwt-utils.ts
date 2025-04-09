import type { EventHandlerRequest, H3Event } from 'h3'

import type { UserInfo } from './mock-data'

import jwt from 'jsonwebtoken'

const ACCESS_TOKEN_SECRET = 'access_token_secret'
const REFRESH_TOKEN_SECRET = 'refresh_token_secret'

export interface UserPayload extends UserInfo {
    iat: number
    exp: number
}

/** 生成AccessToken */
export function generateAccessToken(user: UserInfo) {
    return jwt.sign(user, ACCESS_TOKEN_SECRET, { expiresIn: '7d' })
}

/** 刷新AccessToken */
export function generateRefreshToken(user: UserInfo) {
    return jwt.sign(user, REFRESH_TOKEN_SECRET, { expiresIn: '30d' })
}

/** 验证Token获取内容 */
export function verifyAccessToken(
    event: H3Event<EventHandlerRequest>
): null | Omit<UserInfo, 'password'> {
    const authHeader = getHeader(event, 'Authorization')
    if (!authHeader?.startsWith('Bearer')) {
        return null
    }

    const token = authHeader.split(' ')[1]

    try {
        const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET) as UserPayload
        const username = decoded.username
        const user = MOCK_USERS.find((item) => item.username === username)
        const { password: _pwd, ...userInfo } = user
        return userInfo
    } catch {
        return null
    }
}
