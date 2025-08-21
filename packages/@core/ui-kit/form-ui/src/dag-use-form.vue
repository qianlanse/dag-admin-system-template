<script setup lang="ts">
    import type { Recordable } from '@dag-core/typings'

    import type { DagFormProps, ExtendedFormApi } from './types'

    import { nextTick, onMounted, watch } from 'vue'

    import { useForwardPriorityValues } from '@dag-core/composables'
    import { cloneDeep, get, isEqual, set } from '@dag-core/shared/utils'

    import { useDebounceFn } from '@vueuse/core'

    import FormActions from './components/form-actions.vue'
    import { COMPONENT_BIND_EVENT_MAP, COMPONENT_MAP, DEFAULT_FORM_COMMON_CONFIG } from './config'
    import { Form } from './form-render'
    import { provideComponentRefMap, provideFormProps, useFormInitial } from './use-form-context'

    interface Props extends DagFormProps {
        formApi: ExtendedFormApi
    }

    const props = defineProps<Props>()
    const state = props.formApi?.useStore?.()
    const forward = useForwardPriorityValues(props, state)

    const componentRefMap = new Map<string, unknown>()
    const { delegatedSlots, form } = useFormInitial(forward)

    provideFormProps([forward, form])
    provideComponentRefMap(componentRefMap)

    props.formApi?.mount?.(form, componentRefMap)

    const valuesCache: Recordable<any> = {}

    onMounted(async () => {
        // 只在挂载后开始监听，form.values会有一个初始化的过程
        await nextTick()
        watch(
            () => form.values,
            async (newVal) => {
                if (forward.value.handleValuesChange) {
                    const fields = state.value.schema?.map((item) => {
                        return item.fieldName
                    })

                    if (fields && fields.length > 0) {
                        const changedFields: string[] = []
                        fields.forEach((field) => {
                            const newFieldValue = get(newVal, field)
                            const oldFieldValue = get(valuesCache, field)
                            if (!isEqual(newFieldValue, oldFieldValue)) {
                                changedFields.push(field)
                                set(valuesCache, field, newFieldValue)
                            }
                        })

                        if (changedFields.length > 0) {
                            forward.value.handleValuesChange(
                                cloneDeep(await forward.value.formApi.getValues()),
                                changedFields
                            )
                        }
                    }
                }
                handleValuesChangeDebounced()
            },
            { deep: true }
        )
    })

    // 初始化监听Values变化提交
    const handleValuesChangeDebounced = useDebounceFn(async () => {
        state.value.submitOnChange && forward.value.formApi?.validateAndSubmitForm()
    }, 300)

    // 更新是否展开
    function handleUpdateCollapsed(value: boolean) {
        props.formApi?.setState({ collapsed: !!value })
    }

    // 键盘回车
    function handleKeyDownEnter(event: KeyboardEvent) {
        if (!state.value.submitOnEnter || !forward.value.formApi?.isMounted) {
            return
        }

        if (event.target instanceof HTMLTextAreaElement) {
            return
        }

        event.preventDefault()
        forward.value.formApi.validateAndSubmitForm()
    }
</script>

<template>
    <Form
        @keydown.enter="handleKeyDownEnter"
        v-bind="forward"
        :collapsed="state.collapsed"
        :component-bind-event-map="COMPONENT_BIND_EVENT_MAP"
        :component-map="COMPONENT_MAP"
        :form="form"
        :global-common-config="DEFAULT_FORM_COMMON_CONFIG"
    >
        <template v-for="slotName in delegatedSlots" :key="slotName" #[slotName]="slotProps">
            <slot :name="slotName" v-bind="slotProps"></slot>
        </template>
        <template #default="slotProps">
            <slot v-bind="slotProps">
                <FormActions
                    v-if="forward.showDefaultActions"
                    :model-value="state.collapsed"
                    @update:model-value="handleUpdateCollapsed"
                >
                    <template #reset-before="resetSlotProps">
                        <slot name="reset-before" v-bind="resetSlotProps"></slot>
                    </template>
                    <template #submit-before="submitSlotProps">
                        <slot name="submit-before" v-bind="submitSlotProps"></slot>
                    </template>
                    <template #expand-before="expandBeforeSlotProps">
                        <slot name="expand-before" v-bind="expandBeforeSlotProps"></slot>
                    </template>
                    <template #expand-after="expandAfterSlotProps">
                        <slot name="expand-after" v-bind="expandAfterSlotProps"></slot>
                    </template>
                </FormActions>
            </slot>
        </template>
    </Form>
</template>
