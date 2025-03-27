import type { BaseFormComponentType, DagFormProps, ExtendedFormApi } from './types'

import { defineComponent, h, isReactive, onBeforeUnmount, watch } from 'vue'

import { useStore } from '@dag-core/shared/store'

import DagUseForm from './dag-use-form.vue'
import { FormApi } from './form-api'

export function useDagForm<T extends BaseFormComponentType = BaseFormComponentType>(
    options: DagFormProps<T>
) {
    const IS_REACTIVE = isReactive(options)
    const api = new FormApi(options)
    const extendedApi: ExtendedFormApi = api as never
    extendedApi.useStore = (selector) => {
        return useStore(api.store, selector)
    }

    const Form = defineComponent(
        (props: DagFormProps, { attrs, slots }) => {
            onBeforeUnmount(() => {
                api.unmount()
            })
            api.setState({ ...props, ...slots })
            return () => h(DagUseForm, { ...props, ...attrs, formApi: extendedApi }, slots)
        },
        {
            inheritAttrs: false,
            name: 'DagUseForm'
        }
    )

    if (IS_REACTIVE) {
        watch(
            () => options.schema,
            () => {
                api.setState({ schema: options.schema })
            },
            { immediate: true }
        )
    }

    return [Form, extendedApi] as const
}
