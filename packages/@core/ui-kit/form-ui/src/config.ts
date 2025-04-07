import type { Component } from 'vue'

import type { BaseFormComponentType, FormCommonConfig } from './types'

import { h } from 'vue'

import {
    DagButton,
    DagCheckbox,
    Input as DagInput,
    DagInputPassword,
    DagPinInput,
    DagSelect
} from '@dag-core/shadcn-ui'

export const DEFAULT_FORM_COMMON_CONFIG: FormCommonConfig = {}

export const COMPONENT_MAP: Record<BaseFormComponentType, Component> = {
    DagCheckbox,
    DagInput,
    DagInputPassword,
    DagPinInput,
    DagSelect,
    DefaultButton: h(DagButton, { size: 'sm', variant: 'outline' }),
    PrimaryButton: h(DagButton, { size: 'sm', variant: 'default' })
}

export const COMPONENT_BIND_EVENT_MAP: Partial<Record<BaseFormComponentType, string>> = {
    DagCheckbox: 'checked'
}
