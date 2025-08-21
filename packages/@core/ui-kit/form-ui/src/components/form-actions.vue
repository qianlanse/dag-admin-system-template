<script setup lang="ts">
    import { computed, toRaw, unref, watch } from 'vue'

    import { useSimpleLocale } from '@dag-core/composables'
    import { DagExpandableArrow } from '@dag-core/shadcn-ui'
    import { cn, isFunction, triggerWindowResize } from '@dag-core/shared/utils'

    import { COMPONENT_MAP } from '../config'
    import { injectFormProps } from '../use-form-context'

    const { $t } = useSimpleLocale()
    const collapsed = defineModel<boolean>({ default: false })

    const [rootProps, form] = injectFormProps()

    /** 主容器样式 */
    const actionWrapperClass = computed(() => {
        const props = unref(rootProps)
        const actionLayout = props.actionLayout || 'rowEnd'
        const actionPosition = props.actionPosition || 'right'

        const cls = [
            'flex',
            'w-full',
            'items-center',
            'gap-3',
            props.compact ? 'pb-2' : 'pb-4',
            props.layout === 'vertical' ? 'self-end' : 'self-center',
            props.actionWrapperClass
        ]

        switch (actionLayout) {
            case 'newLine': {
                cls.push('col-span-full')
                break
            }
            case 'rowEnd': {
                cls.push('col-[-2/-1]')
                break
            }
        }

        switch (actionPosition) {
            case 'center': {
                cls.push('justify-center')
                break
            }
            case 'left': {
                cls.push('justify-start')
                break
            }
            default: {
                cls.push('justify-end')
                break
            }
        }

        return cls.join(' ')
    })

    /** 确认按钮配置 */
    const submitButtonOptions = computed(() => {
        return {
            content: `${$t.value('submit')}`,
            show: true,
            ...unref(rootProps).submitButtonOptions
        }
    })

    /** 重置按钮配置 */
    const resetButtonOptions = computed(() => {
        return {
            content: `${$t.value('reset')}`,
            show: true,
            ...unref(rootProps).resetButtonOptions
        }
    })

    /** 确认表单 */
    async function handleSubmit(evt: Event) {
        evt?.preventDefault()
        evt?.stopPropagation()
        const props = unref(rootProps)
        if (!props.formApi) {
            return
        }

        const { valid } = await props.formApi.validate()
        if (!valid) {
            return
        }

        const values = toRaw(await props.formApi.getValues())
        await props.handleSubmit?.(values)
    }

    /** 重置表单 */
    async function handleReset(evt: Event) {
        evt?.preventDefault()
        evt?.stopPropagation()
        const props = unref(rootProps)

        const values = toRaw(await props.formApi?.getValues())

        if (isFunction(props.handleReset)) {
            await props.handleReset?.(values)
        } else {
            form.resetForm()
        }
    }

    watch(
        () => collapsed.value,
        () => {
            const props = unref(rootProps)
            if (props.collapseTriggerResize) {
                triggerWindowResize()
            }
        }
    )

    defineExpose({
        handleReset,
        handleSubmit
    })
</script>

<template>
    <div :class="cn(actionWrapperClass)">
        <template v-if="rootProps.actionButtonsReverse">
            <!-- 提交按钮前 -->
            <slot name="submit-before"></slot>

            <component
                v-if="submitButtonOptions.show"
                :is="COMPONENT_MAP.PrimaryButton"
                type="button"
                v-bind="submitButtonOptions"
                @click="handleSubmit"
            >
                {{ submitButtonOptions.content }}
            </component>
        </template>

        <!-- 重置按钮前 -->
        <slot name="reset-before"></slot>

        <component
            v-if="resetButtonOptions.show"
            :is="COMPONENT_MAP.DefaultButton"
            type="button"
            v-bind="resetButtonOptions"
            @click="handleReset"
        >
            {{ resetButtonOptions.content }}
        </component>

        <template v-if="!rootProps.actionButtonsReverse">
            <!-- 提交按钮前 -->
            <slot name="submit-before"></slot>

            <component
                v-if="submitButtonOptions.show"
                :is="COMPONENT_MAP.PrimaryButton"
                type="button"
                v-bind="submitButtonOptions"
                @click="handleSubmit"
            >
                {{ submitButtonOptions.content }}
            </component>
        </template>

        <!-- 展开按钮前 -->
        <slot name="expand-before"></slot>

        <DagExpandableArrow
            v-if="rootProps.showCollapseButton"
            v-model:model-value="collapsed"
            class="ml-[-0.3em]"
        >
            <span>{{ collapsed ? $t('expand') : $t('collapse') }}</span>
        </DagExpandableArrow>

        <!-- 展开按钮后 -->
        <slot name="expand-after"></slot>
    </div>
</template>
