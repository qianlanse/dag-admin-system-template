import type { MenuRecordRaw } from '@dag-core/typings'

interface NormalMenuProps {
    /** 激活菜单路径 */
    activePath?: string
    /** 是否折叠 */
    collapse?: boolean
    /** 菜单项 */
    menus?: MenuRecordRaw[]
    /** 是否圆润风格 */
    rounded?: boolean
    /** 主体 */
    theme?: 'dark' | 'light'
}

export type { NormalMenuProps }
