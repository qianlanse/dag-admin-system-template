import type { IContextMenuItem } from '@dag-core/shadcn-ui'
import type { TabDefinition, TabsStyleType } from '@dag-core/typings'

export type TabsEmits = {
    close: [string]
    sortTabs: [number, number]
    unpin: [TabDefinition]
}

export interface TabsProps {
    /** 激活 */
    active?: string
    /**
     * 内容样式类
     * @default tabs-chrome
     */
    contentClass?: string
    /** 右键菜单 */
    contextMenus?: (data: any) => IContextMenuItem[]
    /** 是否可以拖拽 */
    draggable?: boolean
    /**
     * 间隙(仅限 tabs-chrome)
     * @default 7
     */
    gap?: number
    /** tab最大宽度(仅限 tabs-chrome) */
    maxWidth?: number
    /** 点击中键时关闭Tab */
    middleClickToClose?: boolean
    /** tab最小宽度(仅限 tabs-chrome) */
    minWidth?: number
    /** 是否显示图标 */
    showIcon?: boolean
    /** 标签页风格 */
    styleType?: TabsStyleType
    /** 选项卡数据 */
    tabs?: TabDefinition[]
    /** 是否响应滚轮事件 */
    wheelable?: boolean
}

export interface TabConfig extends TabDefinition {
    affixTab: boolean
    closeable: boolean
    icon: string
    key: string
    title: string
}
