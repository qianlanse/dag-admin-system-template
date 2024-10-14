import type { Component } from 'vue'

interface DagDropdownMenuItem {
    /**
     * 是否禁用
     */
    disabled?: boolean
    /**
     * 回调函数
     * @param data 参数
     * @returns void
     */
    handler?: (data: any) => void
    /**
     * 图标
     */
    icon?: Component
    /**
     * 标题
     */
    label: string
    /**
     * 是否是分割线
     */
    separator?: boolean
    /**
     * 唯一标识
     */
    value: string
}

interface DropdownMenuProps {
    menus: DagDropdownMenuItem[]
}

export type { DagDropdownMenuItem, DropdownMenuProps }
