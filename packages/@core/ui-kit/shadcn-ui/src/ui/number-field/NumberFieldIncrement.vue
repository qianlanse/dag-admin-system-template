<script setup lang="ts">
    import type { NumberFieldIncrementProps } from 'radix-vue'

    import { computed } from 'vue'

    import { cn } from '@dag-core/shared/utils'

    import { Plus } from 'lucide-vue-next'
    import { NumberFieldIncrement, useForwardProps } from 'radix-vue'

    const props = defineProps<NumberFieldIncrementProps & { class?: any }>()

    const delegatedProps = computed(() => {
        const { class: _, ...delagated } = props
        return delagated
    })

    const forwarded = useForwardProps(delegatedProps)
</script>

<template>
    <NumberFieldIncrement
        v-bind="forwarded"
        data-slot="increment"
        :class="
            cn(
                'absolute right-0 top-1/2 -translate-y-1/2 p-3 disabled:cursor-not-allowed disabled:opacity-20',
                props.class
            )
        "
    >
        <slot>
            <Plus class="size-4" />
        </slot>
    </NumberFieldIncrement>
</template>
