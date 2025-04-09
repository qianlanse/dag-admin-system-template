export default eventHandler((event) => {
    const userInfo = verifyAccessToken(event)
    if (!userInfo) {
        return unAuthorizedResponse(event)
    }
    return useResponseSuccess(userInfo)
})
