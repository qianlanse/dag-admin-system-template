interface BasicOption {
    label: string
    value: string
}

type SelectOption = BasicOption

type TabOption = BasicOption

interface BasicUserInfo {
    /** 头像 */
    avatar: string
    /** 昵称 */
    realName: string
    /** 角色 */
    roles?: string[]
    /** ID */
    userId: string
    /** 用户名 */
    username: string
}

export type { BasicOption, BasicUserInfo, SelectOption, TabOption }
