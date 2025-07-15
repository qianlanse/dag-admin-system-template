import { clearRefreshTokenCookie, getRefreshTokenFromCookie } from '~/utils/cookie-utils'

export default defineEventHandler(async (event) => {
    const refreshToekn = getRefreshTokenFromCookie(event)
    if (!refreshToekn) {
        return useResponseSuccess('')
    }

    clearRefreshTokenCookie(event)

    return useResponseSuccess('')
})
