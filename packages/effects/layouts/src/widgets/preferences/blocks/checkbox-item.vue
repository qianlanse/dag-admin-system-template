<script setup lang="ts">
    import type { SelectOption } from '@dag/types'

    import { useSlots } from 'vue'

    import { CircleHelp } from '@dag/icons'

    import { DagCheckButtonGroup, DagTooltip } from '@dag-core/shadcn-ui'

    defineOptions({
        name: 'PreferenceCheckboxItem'
    })

    withDefaults(
        defineProps<{
            disabled?: boolean
            items?: SelectOption[]
            multiple?: boolean
            onBtnClick?: (value: string) => void
            placeholder?: string
        }>(),
        {
            disabled: false,
            placeholder: '',
            items: () => [],
            onBtnClick: () => {},
            multiple: false
        }
    )

    const slots = useSlots()

    const inputValue = defineModel<string[]>()
</script>

<template>
    <div
        class="my-1 flex w-full items-center justify-between rounded-md px-2 py-1"
        :class="{ 'hover:bg-accent': !slots.tip, 'pointer-events-none opacity-50': disabled }"
    >
        <span class="flex items-center text-sm">
            <slot></slot>

            <DagTooltip v-if="slots.tip" side="bottom">
                <template #trigger>
                    <CircleHelp class="ml-1 size-3 cursor-help" />
                </template>
                <slot name="tip"></slot>
            </DagTooltip>
        </span>

        <DagCheckButtonGroup
            v-model="inputValue"
            class="h-8 w-[165px]"
            :options="items"
            :disabled="disabled"
            :multiple="multiple"
            @btn-click="onBtnClick"
        />
    </div>
</template>
