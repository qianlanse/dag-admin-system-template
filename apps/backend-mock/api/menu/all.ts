export default eventHandler(async (event) => {
    const userInfo = verifyAccessToken(event)
    if (!userInfo) {
        return unAuthorizedResponse(event)
    }

    const menus = MOCK_MENUS.find((item) => item.username === userInfo.username)?.menus ?? []

    return useResponseSuccess(menus)
})
