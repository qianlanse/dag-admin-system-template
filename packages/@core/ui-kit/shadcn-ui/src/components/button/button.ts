import type { AsTag } from 'radix-vue'

import type { Component } from 'vue'

import type { ButtonVariants, ButtonVariantSize } from '../../ui'

export interface DagButtonProps {
    /**
     * 该组件应呈现为的元素或组件，可以被 `asChild` 覆盖
     * @defaultValue "div"
     */
    as?: AsTag | Component
    /**
     * 更改作为子级传递的元素的默认渲染元素，合并它们的道具和行为
     * @see https://www.radix-vue.com/guides/composition.html 了解更多
     */
    asChild?: boolean
    /** 样式类 */
    class?: any
    /** 是否禁用 */
    disabled?: boolean
    /** 是否显示loading */
    loading?: boolean
    /** 按钮大小 */
    size?: ButtonVariantSize
    /** 按钮形式 */
    variant?: ButtonVariants
}

export type CustomRenderType = (() => Component | string) | string

export type ValueType = boolean | number | string

export interface DagButtonGroupProps extends Pick<DagButtonProps, 'disabled'> {
    /** beforeChange事件 */
    beforeChange?: (
        value: ValueType,
        isChecked: boolean
    ) => boolean | PromiseLike<boolean | undefined> | undefined
    /** 样式类 */
    btnClass?: any
    /** 间隙 */
    gap?: number
    /** 是否多选 */
    multiple?: boolean
    /** 配置列表 */
    options?: { label: CustomRenderType; value: ValueType }[]
    /** 是否显示Icon */
    showIcon?: boolean
    /** 大小 */
    size?: 'large' | 'middle' | 'small'
}
