<script setup lang="ts">
    import type { DagFormProps, ExtendedFormApi } from './types'

    import { nextTick, onMounted, watch } from 'vue'

    import { useForwardPriorityValues } from '@dag-core/composables'
    import { cloneDeep } from '@dag-core/shared/utils'

    import { useDebounceFn } from '@vueuse/core'

    import FormActions from './components/form-actions.vue'
    import { COMPONENT_MAP, DEFAULT_FORM_COMMON_CONFIG } from './config'
    import { Form } from './form-render'
    import { provideComponentRefMap, useFormInitial } from './use-form-context'

    interface Props extends DagFormProps {
        formApi: ExtendedFormApi
    }

    const props = defineProps<Props>()
    const state = props.formApi?.useStore?.()
    const forward = useForwardPriorityValues(props, state)

    const componentRefMap = new Map<string, unknown>()
    const { delegatedSlots, form } = useFormInitial(forward)

    provideComponentRefMap(componentRefMap)

    props.formApi?.mount?.(form, componentRefMap)

    onMounted(async () => {
        // 只在挂载后开始监听，form.values会有一个初始化的过程
        await nextTick()
        watch(() => form.values, handleValuesChangeDebounced, { deep: true })
    })

    // 初始化监听Values变化提交
    const handleValuesChangeDebounced = useDebounceFn(async () => {
        forward.value.handleValuesChange?.(cloneDeep(await forward.value.formApi.getValues()))
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
                    <span>123</span>
                </FormActions>
            </slot>
        </template>
    </Form>
</template>
