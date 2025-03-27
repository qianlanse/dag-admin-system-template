import type { CSSProperties } from 'vue'

import type { ClassType } from '@dag/types'

export interface SliderCaptchaProps {
    /**
     * 滑块类
     */
    class?: ClassType
    /**
     * 滑块的样式
     * @default {}
     */
    actionStyle?: CSSProperties
    /**
     * 滑块条的样式
     * @default {}
     */
    barStyle?: CSSProperties
    /**
     * 内容的样式
     * @default {}
     */
    contentStyle?: CSSProperties
    /**
     * 组件的样式
     * @default {}
     */
    wrapperStyle?: CSSProperties
    /**
     * 是否作为插槽使用，用于联动组件，可参考旋转校验组件
     * @default false
     */
    isSlot?: boolean
    /**
     * 验证成功的提示
     * @default 验证通过
     */
    successText?: string
    /**
     * 提示文字
     * @default 请按住滑块拖动
     */
    text?: string
}

/** 滑块旋转验证传递数据 */
export interface SliderRotateVerifyPassingData {
    event: MouseEvent | TouchEvent
    moveDistance: number
    moveX: number
}

/** 验证码验证传递数据 */
export interface CaptchaVerifyPassingData {
    isPassing: boolean
    time: number | string
}
