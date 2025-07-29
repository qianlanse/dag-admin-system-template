<script setup lang="ts">
    import { computed, useSlots } from 'vue'

    import { CircleHelp } from '@dag/icons'

    import { DagTooltip, Switch } from '@dag-core/shadcn-ui'

    defineOptions({
        name: 'PreferenceSwitchItem'
    })

    const props = withDefaults(defineProps<{ disabled?: boolean; tip?: string }>(), {
        disabled: false,
        tip: ''
    })

    const checked = defineModel<boolean>()

    const slots = useSlots()

    const tips = computed(() => props.tip.split('\n'))

    function handleClick() {
        checked.value = !checked.value
    }
</script>

<template>
    <div
        :class="{
            'pointer-events-none opacity-50': disabled
        }"
        class="hover:bg-accent my-1 flex w-full items-center justify-between rounded-md px-2 py-2.5"
        @click="handleClick"
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
        <span v-if="$slots.shortcut" class="ml-auto mr-2 text-xs opacity-60">
            <slot name="shortcut"></slot>
        </span>
        <Switch v-model:checked="checked" @click.stop />
    </div>
</template>
