import type { ModalApiOptions, ModalState } from './types'

import { Store } from '@dag-core/shared/store'
import { bindMethods, isFunction } from '@dag-core/shared/utils'

export class ModalApi {
    public sharedData: Record<'payload', any> = {
        payload: {}
    }

    public store: Store<ModalState>

    private api: Pick<
        ModalApiOptions,
        'onBeforeClose' | 'onCancel' | 'onClosed' | 'onConfirm' | 'onOpenChange' | 'onOpened'
    >

    private state!: ModalState

    constructor(options: ModalApiOptions = {}) {
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

        const defaultState: ModalState = {
            bordered: true,
            centered: false,
            class: '',
            closeOnClickModal: true,
            closeOnPressEscape: true,
            confirmDisabled: false,
            confirmLoading: false,
            contentClass: '',
            destroyOnClose: true,
            draggable: false,
            footer: true,
            footerClass: '',
            fullscreen: false,
            fullscreenButton: true,
            header: true,
            headerClass: '',
            isOpen: false,
            loading: false,
            modal: true,
            openAutoFocus: false,
            showCancelButton: true,
            showConfirmButton: true,
            title: ''
        }

        this.store = new Store<ModalState>(
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
     * 关闭弹窗
     * @description 关闭弹窗时会调用 onBeforeClose 钩子函数，如果 onBeforeClose 返回 false，则不关闭弹窗
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

    getData<T extends object = Record<string, any>>() {
        return (this.sharedData?.payload ?? {}) as T
    }

    lock(isLocked = true) {
        return this.setState({ submitting: isLocked })
    }

    onCancel() {
        if (this.api.onCancel) {
            this.api.onCancel?.()
        } else {
            this.close()
        }
    }

    onClosed() {
        if (!this.state.isOpen) {
            this.api.onClosed?.()
        }
    }

    onConfirm() {
        this.api.onConfirm?.()
    }

    onOpened() {
        if (this.state.isOpen) {
            this.api.onOpened?.()
        }
    }

    open() {
        this.store.setState((state) => ({ ...state, isOpen: true }))
    }

    setData<T>(payload: T) {
        this.sharedData.payload = payload
        return this
    }

    setState(stateOrFn: ((prev: ModalState) => Partial<ModalState>) | Partial<ModalState>) {
        if (isFunction(stateOrFn)) {
            this.store.setState(stateOrFn)
        } else {
            this.store.setState((state) => ({ ...state, ...stateOrFn }))
        }

        return this
    }

    unlock() {
        return this.lock(false)
    }
}
