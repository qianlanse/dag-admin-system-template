import { clearRefreshTokenCookie, getRefreshTokenFromCookie } from '~/utils/cookie-utils'
import { verifyRefreshToken } from '~/utils/jwt-utils'

export default defineEventHandler(async (event) => {
    const refreshToken = getRefreshTokenFromCookie(event)
    if (!refreshToken) {
        return forbiddenResponse(event)
    }

    clearRefreshTokenCookie(event)

    const userInfo = verifyRefreshToken(refreshToken)
    if (!userInfo) {
        return forbiddenResponse(event)
    }

    const findUser = MOCK_USERS.find((item) => item.username === userInfo.username)

    if (!findUser) {
        return forbiddenResponse(event)
    }

    const accessToken = generateAccessToken(findUser)

    setRefreshTokenCookie(event, refreshToken)

    return accessToken
})
