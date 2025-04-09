export default eventHandler((event) => {
    const userInfo = verifyAccessToken(event)
    if (!userInfo) {
        return unAuthorizedResponse(event)
    }

    const codes = MOCK_CODES.find((item) => item.username === userInfo.username)?.codes ?? []

    return useResponseSuccess(codes)
})
