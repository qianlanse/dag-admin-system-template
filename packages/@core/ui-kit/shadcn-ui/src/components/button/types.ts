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
    class?: any
    disabled?: boolean
    loading?: boolean
    size?: ButtonVariantSize
    variant?: ButtonVariants
}
