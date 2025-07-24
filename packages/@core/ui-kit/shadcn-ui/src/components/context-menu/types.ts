import type { Component } from 'vue'

export interface IContextMenuItem {
    /** 是否禁用 */
    disabled?: boolean
    /** 点击事件处理 */
    handler?: (data: any) => void
    /** 图标 */
    icon?: Component
    /** 是否显示图标 */
    inset?: boolean
    /** 唯一标识 */
    key: string
    /** 是否显示分割线 */
    separator?: boolean
    /** 快捷键 */
    shortcut?: string
    /** 标题 */
    text: string
}
