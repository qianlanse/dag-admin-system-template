import type { DrawerApiOptions, DrawerState } from './types'

import { Store } from '@dag-core/shared/store'
import { bindMethods, isFunction } from '@dag-core/shared/utils'

export class DrawerApi {
    public sharedData: Record<'payload', any> = {
        payload: {}
    }
    public store: Store<DrawerState>

    private api: Pick<
        DrawerApiOptions,
        'onBeforeClose' | 'onCancel' | 'onClosed' | 'onConfirm' | 'onOpenChange' | 'onOpened'
    >
    private state!: DrawerState

    constructor(options: DrawerApiOptions = {}) {
        const {
            connectedComponent: _,
            onBeforeClose,
            onCancel,
            onClosed,
            onConfirm,
            onOpenChange,
            onOpened,
            ...storeState
        } = options

        const defaultState: DrawerState = {
            class: '',
            closable: true,
            closeIconPlacement: 'right',
            closeOnClickModal: true,
            closeOnPressEscape: true,
            confirmLoading: false,
            contentClass: '',
            footer: true,
            header: true,
            isOpen: false,
            loading: false,
            modal: true,
            openAutoFocus: false,
            placement: 'right',
            showCancelButton: true,
            showConfirmButton: true,
            submitting: false,
            title: ''
        }

        this.store = new Store<DrawerState>(
            {
                ...defaultState,
                ...storeState
            },
            {
                onUpdate: () => {
                    const state = this.store.state
                    if (state?.isOpen === this.state?.isOpen) {
                        this.state = state
                    } else {
                        this.state = state
                        this.api.onOpenChange?.(!!state?.isOpen)
                    }
                }
            }
        )

        this.state = this.store.state
        this.api = {
            onBeforeClose,
            onCancel,
            onClosed,
            onConfirm,
            onOpenChange,
            onOpened
        }

        bindMethods(this)
    }

    /**
     * 关闭抽屉
     * @description 关闭抽屉时会调用onBeforeClose钩子函数，如果onBeforeClose返回false则不关闭弹窗
     */
    async close() {
        const allowClose = (await this.api.onBeforeClose?.()) ?? true
        if (allowClose) {
            this.store.setState((state) => ({
                ...state,
                isOpen: false,
                submitting: false
            }))
        }
    }

    /**
     * 获取共享数据
     */
    getData<T extends object = Record<string, any>>() {
        return (this.sharedData?.payload ?? {}) as T
    }

    /**
     * 锁定抽屉状态
     * @description 锁定状态将禁用默认的取消按钮，使用spinner覆盖抽屉内容，隐藏关闭按钮，阻止手动关闭弹窗并将默认的提交按钮标记为loading状态
     * @param isLocked 是否锁定
     */
    lock(isLocked: boolean = true) {
        return this.setState({ submitting: isLocked })
    }

    /**
     * 取消操作
     */
    onCancel() {
        if (this.api.onCancel) {
            this.api.onCancel?.()
        } else {
            this.close()
        }
    }

    /**
     * 弹窗关闭(动画播放完毕后的回调)
     */
    onClosed() {
        if (!this.state.isOpen) {
            this.api.onClosed?.()
        }
    }

    /**
     * 确认操作
     */
    onConfirm() {
        this.api.onConfirm?.()
    }

    /**
     * 弹窗打开(动画播放完毕后的回调)
     */
    onOpened() {
        if (this.state.isOpen) {
            this.api.onOpened?.()
        }
    }

    /**
     * 弹窗打开
     */
    open() {
        this.store.setState((state) => ({ ...state, isOpen: true }))
    }

    /**
     * 设置共享值
     */
    setData<T>(payload: T) {
        this.sharedData.payload = payload
        return this
    }

    /**
     * 设置值
     */
    setState(stateOrFn: ((prev: DrawerState) => Partial<DrawerState>) | Partial<DrawerState>) {
        if (isFunction(stateOrFn)) {
            this.store.setState(stateOrFn)
        } else {
            this.store.setState((state) => ({ ...state, ...stateOrFn }))
        }
        return this
    }

    /**
     * 取消锁定
     */
    unlock() {
        return this.lock(false)
    }
}
