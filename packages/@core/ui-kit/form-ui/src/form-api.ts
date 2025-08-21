import type { FormState, GenericObject, ResetFormOpts, ValidationOptions } from 'vee-validate'

import type { ComponentPublicInstance } from 'vue'

import type { Recordable } from '@dag-core/typings'

import type { DagFormProps, FormActions } from './types'

import { isRef, toRaw } from 'vue'

import { Store } from '@dag-core/shared/store'
import {
    bindMethods,
    createMerge,
    isDate,
    isDayjsObject,
    isFunction,
    mergeWithArrayOverride,
    StateHandler
} from '@dag-core/shared/utils'

import { isObject } from '@vueuse/core'

function getDefaultState(): DagFormProps {
    return {
        actionWrapperClass: '',
        collapsed: false,
        collapsedRows: 1,
        collapseTriggerResize: false,
        commonConfig: {},
        handleReset: undefined,
        handleSubmit: undefined,
        handleValuesChange: undefined,
        layout: 'horizontal',
        resetButtonOptions: {},
        schema: [],
        showCollapseButton: false,
        showDefaultActions: true,
        submitButtonOptions: {},
        submitOnChange: false,
        submitOnEnter: false,
        wrapperClass: 'grid-cols-1'
    }
}

export class FormApi {
    public form = {} as FormActions
    isMounted = false

    public state: DagFormProps | null = null
    stateHandler: StateHandler

    public store: Store<DagFormProps>

    /** 组件实例映射 */
    private componentRefMap: Map<string, unknown> = new Map()
    /** 最后一次点击提交时的表单值 */
    private latestSubmissionValues: null | Recordable<any> = null

    private prevState: DagFormProps | null = null

    constructor(options: DagFormProps = {}) {
        const { ...storeState } = options
        const defaultState = getDefaultState()

        this.store = new Store<DagFormProps>(
            {
                ...defaultState,
                ...storeState
            },
            {
                onUpdate: () => {
                    this.prevState = this.state
                    this.state = this.store.state
                    this.updateState()
                }
            }
        )

        this.state = this.store.state
        this.stateHandler = new StateHandler()
        bindMethods(this)
    }

    /**
     * 获取字段组件实例
     * @param fieldName 字段名
     * @returns 组件实例
     */
    getFieldComponentRef<T = ComponentPublicInstance>(fieldName: string): T | undefined {
        let target = this.componentRefMap.has(fieldName)
            ? (this.componentRefMap.get(fieldName) as ComponentPublicInstance)
            : undefined

        if (target && target.$.type.name === 'AsyncComponentWrapper' && target.$.subTree.ref) {
            if (Array.isArray(target.$.subTree.ref)) {
                if (target.$.subTree.ref.length > 0 && isRef(target.$.subTree.ref[0]?.r)) {
                    target = target.$.subTree.ref[0]?.r.value as ComponentPublicInstance
                }
            } else if (isRef(target.$.subTree.ref.r)) {
                target = target.$.subTree.ref.r.value as ComponentPublicInstance
            }
        }

        return target as T
    }

    /** 获取当前聚焦的字段，如果没有聚焦的字段则返回undefined */
    getFocusField() {
        for (const fieldName of this.componentRefMap.keys()) {
            const ref = this.getFieldComponentRef(fieldName)
            if (ref) {
                let el: HTMLElement | null = null
                if (ref instanceof HTMLElement) {
                    el = ref
                } else if (ref.$el instanceof HTMLElement) {
                    el = ref.$el
                }
                if (!el) {
                    continue
                }
                if (el === document.activeElement || el.contains(document.activeElement)) {
                    return fieldName
                }
            }
        }

        return undefined
    }

    /** 最后一次点击提交时的表单值 */
    getLatestSubmissionValues() {
        return this.latestSubmissionValues || {}
    }

    /** 获取状态值 */
    getState() {
        return this.state
    }

    /** 获取表单提交值 */
    async getValues<T = Recordable<any>>() {
        const form = await this.getForm()
        return (form.values ? this.handleRangeTimeValue(form.values) : {}) as T
    }

    async isFieldValid(fieldName: string) {
        const form = await this.getForm()
        return form.isFieldValid(fieldName)
    }

    /** 初始化数据 */
    mount(formActions: FormActions, componentRefMap: Map<string, unknown>) {
        if (!this.isMounted) {
            Object.assign(this.form, formActions)
            this.stateHandler.setConditionTrue()
            this.setLastestSubmissionValues({
                ...toRaw(this.handleRangeTimeValue(this.form.values))
            })
            this.componentRefMap = componentRefMap
            this.isMounted = true
        }
    }

    /**
     * 根据字段名移除表单项
     * @param fields
     */
    async removeSchemaByFields(fields: string[]) {
        const fieldSet = new Set(fields)
        const schema = this.state?.schema ?? []

        const filterSchema = schema.filter((item) => !fieldSet.has(item.fieldName))

        this.setState({
            schema: filterSchema
        })
    }

    /** 重置表单 */
    async resetForm(
        state?: Partial<FormState<GenericObject>> | undefined,
        opts?: Partial<ResetFormOpts>
    ) {
        const form = await this.getForm()
        return form.resetForm(state, opts)
    }

    /** 设置字段值 */
    async setFieldValue(field: string, value: any, shouldValidate?: boolean) {
        const form = await this.getForm()
        form.setFieldValue(field, value, shouldValidate)
    }

    setLastestSubmissionValues(values: null | Recordable<any>) {
        this.latestSubmissionValues = { ...toRaw(values) }
    }

    /** 设置数据 */
    setState(stateOrFn: ((prev: DagFormProps) => Partial<DagFormProps>) | Partial<DagFormProps>) {
        if (isFunction(stateOrFn)) {
            this.store.setState((prev) => {
                return mergeWithArrayOverride(stateOrFn(prev), prev)
            })
        } else {
            this.store.setState((prev) => mergeWithArrayOverride(stateOrFn, prev))
        }
    }

    /**
     * 设置表单值
     * @param fields 表单对象值
     * @param filterFields 过滤不在schema种定义的字段，默认为true
     * @param shouldValidate
     */
    async setValues(
        fields: Record<string, any>,
        filterFields: boolean = true,
        shouldValidate: boolean = false
    ) {
        const form = await this.getForm()
        if (!filterFields) {
            form.setValues(fields, shouldValidate)
            return
        }

        const fieldMergeFn = createMerge((obj, key, value) => {
            if (key in obj) {
                obj[key] =
                    !Array.isArray(obj[key]) &&
                    isObject(obj[key]) &&
                    !isDayjsObject(obj[key]) &&
                    !isDate(obj[key])
                        ? fieldMergeFn(obj[key], value)
                        : value
            }
            return true
        })

        const filteredFields = fieldMergeFn(fields, form.values)
        this.handleStringToArrayFields(filteredFields)
        form.setValues(filteredFields, shouldValidate)
    }

    /** 提交表单 */
    async submitForm(evt?: Event) {
        evt?.preventDefault()
        evt?.stopPropagation()
        const form = await this.getForm()
        await form.submitForm()
        const rawValues = toRaw(await this.getValues())
        await this.state?.handleSubmit?.(rawValues)

        return rawValues
    }

    /** 卸载 */
    unmount() {
        this.form?.resetForm?.()
        this.latestSubmissionValues = null
        this.isMounted = false
        this.stateHandler.reset()
    }

    /** 验证表单 */
    async validate(opts?: Partial<ValidationOptions>) {
        const form = await this.getForm()
        const validateResult = await form.validate(opts)

        if (Object.keys(validateResult?.errors ?? {}).length > 0) {
            console.error('validate error', validateResult?.errors)
        }

        return validateResult
    }

    /** 验证并提交表单 */
    async validateAndSubmitForm() {
        const form = await this.getForm()
        const { valid } = await form.validate()
        if (!valid) {
            return
        }
        return await this.submitForm()
    }

    /** 获取表单实例 */
    private async getForm() {
        if (!this.isMounted) {
            // 等待Form挂载
            await this.stateHandler.waitForCondition()
        }
        if (!this.form?.meta) {
            throw new Error('<DagForm /> is not mounted')
        }

        return this.form
    }

    private handleRangeTimeValue(originValues: Record<string, any>) {
        const values = { ...originValues }

        return values
    }

    /** xxxx */
    private handleStringToArrayFields(originValues: Record<string, any>) {
        const arrayToStringFields = this.state?.arrayToStringFields
        if (!arrayToStringFields || !Array.isArray(arrayToStringFields)) {
            return
        }

        const processFields = (fields: string[], separator: string = ',') => {
            this.processFields(fields, separator, originValues, (value, sep) =>
                Array.isArray(value) ? value.join(sep) : value
            )
        }

        // 处理普通数组
        if (arrayToStringFields.every((item) => typeof item === 'string')) {
            const lastItem = arrayToStringFields[arrayToStringFields.length - 1] || ''
            const fields =
                lastItem.length === 1 ? arrayToStringFields.slice(0, -1) : arrayToStringFields
            const separator = lastItem.length === 1 ? lastItem : ','
            processFields(fields, separator)
            return
        }

        // 处理嵌套数组
        arrayToStringFields.forEach((fieldConfig) => {
            if (Array.isArray(fieldConfig)) {
                const [fields, separator = ','] = fieldConfig
                if (!Array.isArray(fields)) {
                    console.warn(
                        `Invalid field configuration: fields should be an array of strings, got ${typeof fields}`
                    )
                    return
                }
                processFields(fields, separator)
            }
        })
    }

    /** xxxx */
    private processFields(
        fields: string[],
        separator: string,
        originValues: Record<string, any>,
        transformFn: (value: any, separator: string) => any
    ) {
        fields.forEach((field) => {
            const value = originValues[field]
            if (value === undefined || value === null) {
                return
            }
            originValues[field] = transformFn(value, separator)
        })
    }

    /** 重置状态值 */
    private updateState() {
        const currentSchema = this.state?.schema ?? []
        const prevSchema = this.prevState?.schema ?? []

        if (currentSchema.length < prevSchema.length) {
            const currentFields = new Set(currentSchema.map((item) => item.fieldName))
            const deletedSchema = prevSchema.filter((item) => !currentFields.has(item.fieldName))
            for (const schema of deletedSchema) {
                this.form?.setFieldValue?.(schema.fieldName, undefined)
            }
        }
    }
}
