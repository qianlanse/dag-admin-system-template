<script setup lang="ts">
    import type { SelectOption } from '@dag/types'

    import { computed, useSlots } from 'vue'

    import { CircleHelp } from '@dag/icons'

    import {
        DagTooltip,
        NumberField,
        NumberFieldContent,
        NumberFieldDecrement,
        NumberFieldIncrement,
        NumberFieldInput
    } from '@dag-core/shadcn-ui'

    defineOptions({
        name: 'PreferenceNumberFieldItem'
    })

    const props = withDefaults(
        defineProps<{
            disabled?: boolean
            items?: SelectOption[]
            placeholder?: string
            tip?: string
        }>(),
        {
            disabled: false,
            placeholder: '',
            tip: '',
            items: () => []
        }
    )

    const inputValue = defineModel<number>()

    const slots = useSlots()

    const tips = computed(() => props.tip?.split('\n'))
</script>

<template>
    <div
        :class="{
            'hover:bg-accent': !slots.tip,
            'pointer-events-none opacity-50': disabled
        }"
        class="my-1 flex w-full items-center justify-between rounded-md px-2 py-1"
    >
        <span class="flex items-center text-sm">
            <slot></slot>

            <DagTooltip v-if="slots.tip || tip" side="bottom">
                <template #trigger>
                    <CircleHelp class="ml-1 size-3 cursor-help" />
                </template>
                <slot name="tip">
                    <template v-if="tip">
                        <p v-for="(line, index) in tips" :key="index">{{ line }}</p>
                    </template>
                </slot>
            </DagTooltip>
        </span>

        <NumberField v-model="inputValue" v-bind="$attrs" class="w-[165px]">
            <NumberFieldContent>
                <NumberFieldDecrement />
                <NumberFieldInput />
                <NumberFieldIncrement />
            </NumberFieldContent>
        </NumberField>
    </div>
</template>
