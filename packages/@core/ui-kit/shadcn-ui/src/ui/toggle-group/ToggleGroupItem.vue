<script setup lang="ts">
    import type { VariantProps } from 'class-variance-authority'
    import type { ToggleGroupItemProps } from 'radix-vue'

    import { computed, inject } from 'vue'

    import { cn } from '@dag-core/shared/utils'

    import { ToggleGroupItem, useForwardProps } from 'radix-vue'

    import { toggleVariants } from '../toggle'

    type ToggleGroupVariants = VariantProps<typeof toggleVariants>

    interface Props {
        class?: any
        size?: ToggleGroupVariants['size']
        variant?: ToggleGroupVariants['variant']
    }

    const props = defineProps<Props & ToggleGroupItemProps>()

    const delegatedProps = computed(() => {
        const { class: _, size: _size, variant: _variant, ...delegated } = props
        return delegated
    })

    const context = inject<ToggleGroupVariants>('toggleGroup')

    const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
    <ToggleGroupItem
        v-bind="forwardedProps"
        :class="
            cn(
                toggleVariants({
                    variant: context?.variant || variant,
                    size: context?.size || size
                }),
                props.class
            )
        "
    >
        <slot></slot>
    </ToggleGroupItem>
</template>
