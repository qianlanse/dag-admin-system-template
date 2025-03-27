import type { ValidationOptions } from 'vee-validate'

import type { Recordable } from '@dag-core/typings'

import type { DagFormProps, FormActions } from './types'

import { toRaw } from 'vue'

import { Store } from '@dag-core/shared/store'
import {
    bindMethods,
    isFunction,
    mergeWithArrayOverride,
    StateHandler
} from '@dag-core/shared/utils'

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
    private latestSubmissionValues: null | Recordable<any> = null

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
                    // -
                }
            }
        )

        this.state = this.store.state
        this.stateHandler = new StateHandler()
        bindMethods(this)
    }

    // 获取表单提交值
    async getValues<T = Recordable<any>>() {
        const form = await this.getForm()
        return (form.values ? this.handleRangeTimeValue(form.values) : {}) as T
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
            console.error('Validate error:', validateResult?.errors)
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
}
