import { acceptHMRUpdate, defineStore } from 'pinia'

interface BasicUserInfo {
    [key: string]: any
    /**
     * 头像
     */
    avatar: string
    /**
     * 昵称
     */
    realName: string
    /**
     * 角色
     */
    roles?: string[]
    /**
     * 用户ID
     */
    userId: string
    /**
     * 用户名
     */
    username: string
}

interface AssessState {
    /**
     * 用户信息
     */
    userInfo: BasicUserInfo | null
    /**
     * 用户角色
     */
    userRoles: string[]
}

/**
 * 用户信息
 */
export const useUserStore = defineStore('user', {
    actions: {
        // 设置用户信息
        setUserInfo(userInfo: BasicUserInfo | null) {
            this.userInfo = userInfo
            const roles = userInfo?.roles ?? []
            this.setUserRoles(roles)
        },
        // 设置用户角色
        setUserRoles(roles: string[]) {
            this.userRoles = roles
        }
    },
    state: (): AssessState => ({
        userInfo: null,
        userRoles: []
    })
})

// 热更新
const hot = import.meta.hot
if (hot) {
    hot.accept(acceptHMRUpdate(useUserStore, hot))
}
