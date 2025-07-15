import type { Component, Ref } from 'vue'

import type { MaybePromise } from '@dag-core/typings'

import type { ModalApi } from './modal-api'

export interface ModalProps {
    /** 是否要挂载到内容区域 */
    appendToMain?: boolean
    /** 是否显示边框 */
    bordered?: boolean
    /** 取消按钮文字 */
    cancelText?: string
    /** 是否居中 */
    centered?: boolean
    /** 样式类 */
    class?: string
    /** 是否显示右上角的关闭按钮 */
    closeable?: boolean
    /** 点击弹窗遮罩是否关闭弹窗 */
    closeOnClickModal?: boolean
    /** 按下 ESC 键是否关闭弹窗 */
    closeOnPressEscape?: boolean
    /** 禁用确认按钮 */
    confirmDisabled?: boolean
    /** 确定按钮 loading */
    confirmLoading?: boolean
    /** 确定按钮文字 */
    confirmText?: string
    /** 内容样式类 */
    contentClass?: string
    /** 弹窗描述 */
    description?: string
    /** 在关闭时销毁弹窗 */
    destroyOnClose?: boolean
    /** 是否可拖拽 */
    draggable?: boolean
    /** 是否显示底部 */
    footer?: boolean
    /** 底部样式类 */
    footerClass?: string
    /** 是否全屏 */
    fullscreen?: boolean
    /** 是否显示全屏按钮 */
    fullscreenButton?: boolean
    /** 是否显示顶栏 */
    header?: boolean
    /** 顶栏样式类 */
    headerClass?: string
    /** 弹窗是否显示 */
    loading?: boolean
    /** 是否显示遮罩 */
    modal?: boolean
    /** 是否自动聚焦 */
    openAutoFocus?: boolean
    /** 弹窗遮罩模糊效果 */
    overlayBlur?: number
    /** 是否显示取消按钮 */
    showCancelButton?: boolean
    /** 是否显示确认按钮 */
    showConfirmButton?: boolean
    /** 提交中（锁定弹窗状态） */
    submitting?: boolean
    /** 弹窗标题 */
    title?: string
    /** 弹窗标题提示 */
    titleTooltip?: string
    /** 弹窗层级 */
    zIndex?: number
}

export interface ModalState extends ModalProps {
    isOpen?: boolean
    sharedData?: Record<string, any>
}

export type ExtendedModalApi = ModalApi & {
    useStore: <T = NoInfer<ModalState>>(
        selector?: (state: NoInfer<ModalState>) => T
    ) => Readonly<Ref<T>>
}

export interface ModalApiOptions extends ModalState {
    /** 独立的弹窗组件 */
    connectedComponent?: Component
    /** 关闭前的回调，返回 false 可以阻止关闭 */
    onBeforeClose?: () => MaybePromise<boolean | undefined>
    /** 点击取消按钮的回调 */
    onCancel?: () => void
    /** 弹窗关闭动画结束的回调 */
    onClosed?: () => void
    /** 点击确定按钮的回调 */
    onConfirm?: () => void
    /** 弹窗状态变化回调 */
    onOpenChange?: (isOpen: boolean) => void
    /** 弹窗打开动画结束的回调 */
    onOpened?: () => void
}
