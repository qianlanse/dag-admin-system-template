import type { ExtendedModalApi, ModalApiOptions, ModalProps } from './types'

import { defineComponent, h, inject, nextTick, provide, reactive, ref } from 'vue'

import { useStore } from '@dag-core/shared/store'

import { ModalApi } from './modal-api'
import DagModal from './modal.vue'

const USER_MODAL_INJECT_KEY = Symbol('DAG_MODAL_INJECT')
const DEFAULT_MODAL_PROPS: Partial<ModalProps> = {}

async function checkProps(api: ExtendedModalApi, attrs: Record<string, any>) {
    if (!attrs || Object.keys(attrs).length === 0) {
        return
    }

    await nextTick()

    const state = api?.store?.state

    if (!state) {
        return
    }

    const stateKeys = new Set(Object.keys(state))

    for (const attr of Object.keys(attrs)) {
        if (stateKeys.has(attr) && !['class'].includes(attr)) {
            console.warn(
                `[Dag Modal]: When 'connectedComponent' exists, do not set props or slots '${attr}', which will increase complexity. If you need to modify the props of Modal, please use useVbenModal or api.`
            )
        }
    }
}

export function useDagModal<TParentModalProps extends ModalProps = ModalProps>(
    options: ModalApiOptions = {}
) {
    const { connectedComponent } = options
    if (connectedComponent) {
        const extendedApi = reactive({})
        const isModalReady = ref(true)
        const Modal = defineComponent(
            (props: TParentModalProps, { attrs, slots }) => {
                provide(USER_MODAL_INJECT_KEY, {
                    extendedApi(api: ExtendedModalApi) {
                        Object.setPrototypeOf(extendedApi, api)
                    },
                    options,
                    async reCreateModal() {
                        isModalReady.value = false
                        await nextTick()
                        isModalReady.value = true
                    }
                })

                checkProps(extendedApi as ExtendedModalApi, {
                    ...props,
                    ...attrs,
                    ...slots
                })

                return () =>
                    h(
                        isModalReady.value ? connectedComponent : 'div',
                        { ...props, ...attrs },
                        slots
                    )
            },
            {
                inheritAttrs: false,
                name: 'DagParentModal'
            }
        )

        return [Modal, extendedApi as ExtendedModalApi] as const
    }

    const injectData = inject<any>(USER_MODAL_INJECT_KEY, {})
    const mergedOptions = {
        ...DEFAULT_MODAL_PROPS,
        ...injectData.options,
        ...options
    } as ModalApiOptions

    mergedOptions.onOpenChange = (isOpen: boolean) => {
        options.onOpenChange?.(isOpen)
        injectData.options?.onOpenChange?.(isOpen)
    }

    const onClosed = mergedOptions.onClosed
    mergedOptions.onClosed = () => {
        onClosed?.()
        if (mergedOptions.destroyOnClose) {
            injectData.reCreateModal?.()
        }
    }

    const api = new ModalApi(mergedOptions)
    const extendedApi: ExtendedModalApi = api as never

    extendedApi.useStore = (selector) => {
        return useStore(api.store, selector)
    }

    const Modal = defineComponent(
        (props: ModalProps, { attrs, slots }) => {
            return () => h(DagModal, { ...props, ...attrs, modalApi: extendedApi }, slots)
        },
        {
            inheritAttrs: false,
            name: 'DagModal'
        }
    )

    injectData.extendApi?.(extendedApi)

    return [Modal, extendedApi] as const
}
