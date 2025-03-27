<script setup lang="ts">
    import type { FormSchema, MaybeComponentProps } from '../types'

    import { computed, onUnmounted, useTemplateRef, watch } from 'vue'

    import {
        DagRenderContent,
        FormControl,
        FormDescription,
        FormField,
        FormItem,
        FormMessage
    } from '@dag-core/shadcn-ui'
    import { cn, isFunction, isObject, isString } from '@dag-core/shared/utils'

    import { toTypedSchema } from '@vee-validate/zod'
    import { useFormValues } from 'vee-validate'
    import { ZodType } from 'zod'

    import { injectComponentRefMap } from '../use-form-context'
    import { injectRenderFormProps, useFormContext } from './context'
    import useDependencies from './dependencies'
    import FormLabel from './form-label.vue'
    import { isEventObjectLike } from './helper'

    interface Props extends FormSchema {
        commonComponentProps: MaybeComponentProps
    }

    const {
        commonComponentProps,
        component,
        componentProps,
        dependencies,
        description,
        disabled,
        disabledOnChangeListener,
        disabledOnInputListener,
        emptyStateValue,
        fieldName,
        formFieldProps,
        label,
        labelClass,
        labelWidth,
        modelPropName,
        renderComponentContent,
        rules
    } = defineProps<Props>()

    const { componentBindEventMap, componentMap, isVertical } = useFormContext()
    const { dynamicComponentProps, dynamicRules, isDisabled, isIf, isRequired, isShow } =
        useDependencies(() => dependencies)
    const formRenderProps = injectRenderFormProps()
    const values = useFormValues()
    const fieldComponentRef = useTemplateRef<HTMLInputElement>('fieldComponentRef')
    const formApi = formRenderProps.form
    const compact = formRenderProps.compact
    const isInValid = computed(() => false)

    const labelStyle = computed(() => {
        return labelClass?.includes('w-') || isVertical.value
            ? {}
            : {
                  width: `${labelWidth}px`
              }
    })

    const customContentRender = computed(() => {
        if (!isFunction(renderComponentContent)) {
            return {}
        }
        return renderComponentContent(values.value, formApi!)
    })

    const renderContentKey = computed(() => {
        return Object.keys(customContentRender.value)
    })

    const visible = computed(() => {
        return isIf.value && isShow.value
    })

    const currentRules = computed(() => {
        return dynamicRules.value || rules
    })

    const shouldRequired = computed(() => {
        if (!visible.value) {
            return
        }

        if (!currentRules.value) {
            return isRequired.value
        }

        if (isRequired.value) {
            return true
        }

        if (isString(currentRules.value)) {
            return ['required', 'selectRequired'].includes(currentRules.value)
        }

        let isOptional = currentRules.value?.isOptional?.()

        // 如果有设置默认值，则不是必填，需要特殊处理
        const typeName = currentRules?.value?._def?.typeName
        if (typeName === 'ZodDefault') {
            const innerType = currentRules?.value?._def.innerType
            if (innerType) {
                isOptional = innerType.isOptional?.()
            }
        }

        return !isOptional
    })

    const fieldRules = computed(() => {
        if (!visible.value) {
            return null
        }

        let rules = currentRules.value
        if (!rules) {
            return isRequired.value ? 'required' : null
        }

        if (isString(rules)) {
            return rules
        }

        const isOptional = !shouldRequired.value
        if (!isOptional) {
            const unwrapperRules = (rules as any)?.unwrap?.()
            if (unwrapperRules) {
                rules = unwrapperRules
            }
        }

        return toTypedSchema(rules as ZodType)
    })

    const shouldDisabled = computed(() => {
        return isDisabled.value || disabled || computedProps.value?.disabled
    })

    const fieldProps = computed(() => {
        const rules = fieldRules.value
        return {
            keepValue: true,
            label: isString(label) ? label : '',
            ...(rules ? { rules } : {}),
            ...(formFieldProps as Record<string, any>)
        }
    })

    const computedProps = computed(() => {
        const finalComponentProps = isFunction(componentProps)
            ? componentProps(values.value, formApi!)
            : componentProps

        return {
            ...commonComponentProps,
            ...finalComponentProps,
            ...dynamicComponentProps.value
        }
    })

    // 渲染指定类型组件
    const FieldComponent = computed(() => {
        const finalComponent = isString(component) ? componentMap.value[component] : component
        if (!finalComponent) {
            console.warn(`Component ${component} is not registered`)
        }

        return finalComponent
    })

    /** 给Field绑定事件 */
    function fieldBindEvent(slotProps: Record<string, any>) {
        const modelValue = slotProps.componentField.modelValue
        const handler = slotProps.componentField['onUpdate:modelValue']

        const bindEventField =
            modelPropName || (isString(component) ? componentBindEventMap.value?.[component] : null)

        let value = modelValue
        if (modelValue && isObject(modelValue) && bindEventField) {
            value = isEventObjectLike(modelValue)
                ? modelValue?.target?.[bindEventField]
                : (modelValue?.[bindEventField] ?? modelValue)
        }

        if (bindEventField) {
            return {
                [`onUpdate:${bindEventField}`]: handler,
                [bindEventField]: value === undefined ? emptyStateValue : value,
                onChange: disabledOnChangeListener
                    ? undefined
                    : (evt: Record<string, any>) => {
                          const shouldUnwrap = isEventObjectLike(evt)
                          const onChange = slotProps?.componentField?.onChange

                          if (!shouldUnwrap) {
                              return onChange?.(evt)
                          }

                          return onChange?.(evt?.target?.[bindEventField] ?? evt)
                      },
                ...(disabledOnInputListener ? { onInput: undefined } : {})
            }
        }

        return {
            ...(disabledOnInputListener ? { onInput: undefined } : {}),
            ...(disabledOnChangeListener ? { onChange: undefined } : {})
        }
    }

    /** 创建组件数据 */
    function createComponentProps(slotProps: Record<string, any>) {
        const bindEvents = fieldBindEvent(slotProps)

        return {
            ...slotProps.componentField,
            ...computedProps.value,
            ...bindEvents,
            ...(Reflect.has(computedProps.value, 'onChange')
                ? {
                      onChange: computedProps.value.onChange
                  }
                : {}),
            ...(Reflect.has(computedProps.value, 'onInput')
                ? {
                      onInput: computedProps.value.onInput
                  }
                : {})
        }
    }

    const componentRefMap = injectComponentRefMap()

    onUnmounted(() => {
        if (componentRefMap?.has(fieldName)) {
            componentRefMap.delete(fieldName)
        }
    })

    watch(fieldComponentRef, (componentRef) => {
        componentRefMap?.set(fieldName, componentRef)
    })
</script>

<template>
    <FormField v-bind="fieldProps" v-slot="slotProps" :name="fieldName">
        <FormItem
            v-show="isShow"
            :class="{
                'form-valid-error': isInValid,
                'flex-col': isVertical,
                'flex-row items-center': !isVertical,
                'pb-6': !compact,
                'pb-2': compact
            }"
            class="relative flex"
            v-bind="$attrs"
        >
            <FormLabel
                v-if="!hideLabel"
                :class="
                    cn(
                        'flex leading-6',
                        {
                            'mr-2 flex-shrink-0 justify-end': !isVertical,
                            'mb-1 flex-row': isVertical
                        },
                        labelClass
                    )
                "
                :help="help"
                :colon="colon"
                :label="label"
                :required="shouldRequired && !hideRequiredMark"
                :style="labelStyle"
            >
                <template v-if="label">
                    <DagRenderContent :content="label" />
                </template>
            </FormLabel>
            <div class="w-full overflow-hidden">
                <div :class="cn('relative flex w-full items-center', wrapperClass)">
                    <div class="flex-auto overflow-hidden p-[2px]">
                        <FormControl :class="cn(controlClass)">
                            <slot
                                v-bind="{
                                    ...slotProps,
                                    ...createComponentProps(slotProps),
                                    disabled: shouldDisabled,
                                    isInValid
                                }"
                            >
                                <!-- 渲染组件 -->
                                <component
                                    :is="FieldComponent"
                                    ref="fieldComponentRef"
                                    :class="{
                                        'border-destructive focus:border-destructive hover:border-destructive/80 focus:shadow-[0_0_0_2px_rgba(255, 38, 5, 0.06)]':
                                            isInValid
                                    }"
                                    v-bind="createComponentProps(slotProps)"
                                    :disabled="shouldDisabled"
                                >
                                    <template
                                        v-for="name in renderContentKey"
                                        :key="name"
                                        #[name]="renderSlotProps"
                                    >
                                        <DagRenderContent
                                            :content="customContentRender[name]"
                                            v-bind="{ ...renderSlotProps, formContext: slotProps }"
                                        />
                                    </template>
                                </component>
                            </slot>
                        </FormControl>
                    </div>

                    <!-- 自定义后缀 -->
                    <div v-if="suffix" class="ml-1">
                        <DagRenderContent :content="suffix" />
                    </div>
                    <!-- 描述 -->
                    <FormDescription v-if="description" class="ml-1">
                        <DagRenderContent :content="description" />
                    </FormDescription>
                </div>

                <!-- 错误信息 -->
                <Transition name="slide-up">
                    <FormMessage class="absolute bottom-1" />
                </Transition>
            </div>
        </FormItem>
    </FormField>
</template>
