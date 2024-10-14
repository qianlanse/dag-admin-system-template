<script setup lang="ts">
    import type { ButtonVariants } from '../../ui'
    import type { DagButtonProps } from './types'

    import { computed, useSlots } from 'vue'

    import { cn } from '@dag-core/shared/utils'

    import DagButton from './button.vue'

    interface Props extends DagButtonProps {
        class?: any
        disabled?: boolean
        onClick?: () => void
        tooltip?: string
        tooltipSide?: 'bottom' | 'left' | 'right' | 'top'
        variant?: ButtonVariants
    }

    const props = withDefaults(defineProps<Props>(), {
        disabled: false,
        onClick: () => {},
        tooltipSide: 'bottom',
        variant: 'icon'
    })

    const slots = useSlots()

    const showTooltip = computed(() => !!slots.tooltip || !!props.tooltip)
</script>

<template>
    <DagButton
        v-if="!showTooltip"
        :class="cn('rounded-full', props.class)"
        :disabled="disabled"
        :variant="variant"
        size="icon"
        @click="onClick"
    >
        <slot></slot>
    </DagButton>
</template>
