import type { Component } from 'vue'

import type { BaseFormComponentType } from '@dag/common-ui'
import type { Recordable } from '@dag/types'

import { defineComponent, h, ref } from 'vue'

import { ApiComponent, globalShareState } from '@dag/common-ui'
import { $t } from '@dag/locales'

import {
    NCheckbox,
    NCheckboxGroup,
    NDatePicker,
    NInput,
    NInputNumber,
    NRadio,
    NRadioButton,
    NRadioGroup,
    NSelect,
    NSpace,
    NTreeSelect
} from 'naive-ui'

import { message } from '#/adapter/naive'

export type ComponentType =
    | 'ApiSelect'
    | 'ApiTreeSelect'
    | 'Checkbox'
    | 'CheckboxGroup'
    | 'DatePicker'
    | 'Divider'
    | 'IconPicker'
    | 'Input'
    | 'InputNumber'
    | 'RadioGroup'
    | 'Select'
    | 'Space'
    | 'Switch'
    | 'TimePicker'
    | 'TreeSelect'
    | 'Upload'
    | BaseFormComponentType

const withDefaultPlaceholder = <T extends Component>(
    component: T,
    type: 'input' | 'select',
    componentProps: Recordable<any> = {}
) => {
    return defineComponent({
        name: component.name,
        inheritAttrs: false,
        setup(props: any, { attrs, expose, slots }) {
            const placeholder =
                props?.placeholder || attrs?.placeholder || $t(`ui.placeholder.${type}`)

            const innerRef = ref()

            expose(
                new Proxy(
                    {},
                    {
                        get: (_, key) => innerRef.value?.[key],
                        has: (_, key) => key in (innerRef.value || {})
                    }
                )
            )

            return () =>
                h(
                    component,
                    { ...componentProps, placeholder, ...props, ...attrs, ref: innerRef },
                    slots
                )
        }
    })
}

async function initComponentAdapter() {
    const components: Partial<Record<ComponentType, Component>> = {
        ApiSelect: withDefaultPlaceholder(
            {
                ...ApiComponent,
                name: 'ApiSelect'
            },
            'select',
            {
                component: NSelect,
                modelPropName: 'value'
            }
        ),
        ApiTreeSelect: withDefaultPlaceholder(
            {
                ...ApiComponent,
                name: 'ApiTreeSelect'
            },
            'select',
            {
                component: NTreeSelect,
                nodeKey: 'value',
                loadingSlot: 'arrow',
                keyField: 'value',
                modelPropName: 'value',
                optionsPropName: 'options',
                visibleEvent: 'onVisibleChange'
            }
        ),
        Input: withDefaultPlaceholder(NInput, 'input'),
        InputNumber: withDefaultPlaceholder(NInputNumber, 'input'),
        RadioGroup: (props, { attrs, slots }) => {
            let defaultSlot
            if (Reflect.has(slots, 'default')) {
                defaultSlot = slots.default
            } else {
                const { options } = attrs
                if (Array.isArray(options)) {
                    defaultSlot = () =>
                        options.map((option) => h(attrs.isButton ? NRadioButton : NRadio, option))
                }
            }
            const groupRender = h(NRadioGroup, { ...props, ...attrs }, { default: defaultSlot })
            return attrs.isButton ? h(NSpace, { vertical: true }, () => groupRender) : groupRender
        },
        CheckboxGroup: (props, { attrs, slots }) => {
            let defaultSlot
            if (Reflect.has(slots, 'default')) {
                defaultSlot = slots.default
            } else {
                const { options } = attrs
                if (Array.isArray(options)) {
                    defaultSlot = () => options.map((option) => h(NCheckbox, option))
                }
            }
            return h(NCheckboxGroup, { ...props, ...attrs }, { default: defaultSlot })
        },
        DatePicker: NDatePicker,
        Select: withDefaultPlaceholder(NSelect, 'select')
    }

    // 将组件注册到全局共享状态中
    globalShareState.setComponents(components)

    // 定义全局共享状态中的消息提示
    globalShareState.defineMessage({
        copyPreferencesSuccess: (title, content) => {
            message.success(content || title, {
                duration: 3000
            })
        }
    })
}

export { initComponentAdapter }
