<script setup lang="ts">
    import { useSlots } from 'vue'

    import { CircleHelp } from '@dag/icons'

    import { DagTooltip, Input } from '@dag-core/shadcn-ui'

    defineOptions({
        name: 'PreferenceInputItem'
    })

    withDefaults(
        defineProps<{
            disabled?: boolean
            placeholder?: string
        }>(),
        {
            disabled: false,
            placeholder: ''
        }
    )

    const inputValue = defineModel<string>()

    const slots = useSlots()
</script>

<template>
    <div
        :class="{
            'hover:bg-accent': !slots.tip,
            'pointer-events-none opacity-50': disabled
        }"
        class="my-1 flex w-full items-center justify-between rounded-md px-2 py-1"
    >
        <div class="flex items-center text-sm">
            <slot></slot>
            <DagTooltip v-if="slots.tip" side="bottom">
                <template #trigger>
                    <CircleHelp class="ml-1 size-3 cursor-help" />
                </template>
                <slot name="tip"></slot>
            </DagTooltip>
        </div>
        <Input v-model="inputValue" :placeholder="placeholder" class="h-8 w-[165px]" />
    </div>
</template>
