<script setup lang="ts">
    import type { NumberFieldDecrementProps } from 'radix-vue'

    import { computed } from 'vue'

    import { cn } from '@dag-core/shared/utils'

    import { Minus } from 'lucide-vue-next'
    import { NumberFieldDecrement, useForwardProps } from 'radix-vue'

    const props = defineProps<NumberFieldDecrementProps & { class?: any }>()

    const delegatedProps = computed(() => {
        const { class: _, ...delagated } = props
        return delagated
    })

    const forwarded = useForwardProps(delegatedProps)
</script>

<template>
    <NumberFieldDecrement
        v-bind="forwarded"
        data-slot="decrement"
        :class="
            cn(
                'absolute left-0 top-1/2 -translate-y-1/2 p-3 disabled:cursor-not-allowed disabled:opacity-20',
                props.class
            )
        "
    >
        <slot>
            <Minus class="size-4" />
        </slot>
    </NumberFieldDecrement>
</template>
