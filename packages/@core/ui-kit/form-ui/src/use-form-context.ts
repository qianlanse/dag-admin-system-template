import type { ZodRawShape } from 'zod'

import type { ComputedRef } from 'vue'

import type { DagFormProps, ExtendedFormApi, FormActions } from './types'

import { computed, unref, useSlots } from 'vue'

import { createContext } from '@dag-core/shadcn-ui'
import { isString } from '@dag-core/shared/utils'

import { useForm } from 'vee-validate'
import { object } from 'zod'
import { getDefaultsForSchema } from 'zod-defaults'

type ExtendFormProps = DagFormProps & { formApi: ExtendedFormApi }

export const [injectFormProps, provideFormProps] =
    createContext<[ComputedRef<ExtendFormProps> | ExtendFormProps, FormActions]>('DagFormProps')

export const [injectComponentRefMap, provideComponentRefMap] =
    createContext<Map<string, unknown>>('ComponentRefMap')

/**
 * 初始化Form表单
 * @param props
 */
export function useFormInitial(props: ComputedRef<DagFormProps> | DagFormProps) {
    const slots = useSlots()
    const initialValues = generateInitialValues()

    const form = useForm({
        ...(Object.keys(initialValues)?.length ? { initialValues } : {})
    })
    const delegatedSlots = computed(() => {
        const resultSlots: string[] = []

        for (const key of Object.keys(slots)) {
            if (key !== 'default') {
                resultSlots.push(key)
            }
        }

        return resultSlots
    })

    function generateInitialValues() {
        const initialValues: Record<string, any> = {}

        const zodObject: ZodRawShape = {}
        ;(unref(props).schema || []).forEach((item) => {
            if (Reflect.has(item, 'defaultValue')) {
                initialValues[item.fieldName] = item.defaultValue
            } else if (item.rules && !isString(item.rules)) {
                zodObject[item.fieldName] = item.rules
            }
        })

        /**
         * schema 生成默认值
         * @see https://www.npmjs.com/package/zod-defaults
         */
        const schemaInitialValues = getDefaultsForSchema(object(zodObject))

        return { ...initialValues, ...schemaInitialValues }
    }

    return {
        delegatedSlots,
        form
    }
}
