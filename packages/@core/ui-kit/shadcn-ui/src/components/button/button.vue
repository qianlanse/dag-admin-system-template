<script setup lang="ts">
    import type { DagButtonProps } from './types'

    import { computed } from 'vue'

    import { LoaderCircle } from '@dag-core/icons'
    import { cn } from '@dag-core/shared/utils'

    import { Primitive } from 'radix-vue'

    import { buttonVariants } from '../../ui'

    interface Props extends DagButtonProps {}

    const props = withDefaults(defineProps<Props>(), {
        as: 'button',
        class: '',
        disabled: false,
        loading: false,
        size: 'default',
        variant: 'default'
    })

    const isDisabled = computed(() => props.disabled || props.loading)
</script>

<template>
    <Primitive
        :as="as"
        :as-child="asChild"
        :class="cn(buttonVariants({ variant, size }), props.class)"
        :disabled="isDisabled"
    >
        <LoaderCircle v-if="loading" class="text-md mr-2 size-4 flex-shrink-0 animate-spin" />
        <slot></slot>
    </Primitive>
</template>
