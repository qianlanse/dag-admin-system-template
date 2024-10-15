<script setup lang="ts">
    import type { VariantProps } from 'class-variance-authority'

    import type { toggleVariants } from '../toggle'

    import { computed, provide } from 'vue'

    import { cn } from '@dag-core/shared/utils'

    import {
        ToggleGroupRoot,
        type ToggleGroupRootEmits,
        type ToggleGroupRootProps,
        useForwardPropsEmits
    } from 'radix-vue'

    type ToggleGroupVariants = VariantProps<typeof toggleVariants>

    interface Props {
        class?: any
        size?: ToggleGroupVariants['size']
        variant?: ToggleGroupVariants['variant']
    }
    const props = defineProps<Props & ToggleGroupRootProps>()
    const emits = defineEmits<ToggleGroupRootEmits>()

    provide('toggleGroup', {
        size: props.size,
        variant: props.variant
    })

    const delegatedProps = computed(() => {
        const { class: _, ...delegated } = props
        return delegated
    })

    const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
    <ToggleGroupRoot
        v-bind="forwarded"
        :class="cn('flex items-center justify-center gap-1', props.class)"
    >
        <slot></slot>
    </ToggleGroupRoot>
</template>
