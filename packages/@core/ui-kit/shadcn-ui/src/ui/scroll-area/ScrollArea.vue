<script setup lang="ts">
    import type { ScrollAreaRootProps } from 'radix-vue'

    import { computed } from 'vue'

    import { cn } from '@dag-core/shared/utils'

    import { ScrollAreaCorner, ScrollAreaRoot, ScrollAreaViewport } from 'radix-vue'

    import ScrollBar from './ScrollBar.vue'

    interface Props extends ScrollAreaRootProps {
        class?: any
        onScroll?: (event: Event) => void
        viewportProps?: { onScroll: (event: Event) => void }
    }

    const props = withDefaults(defineProps<Props>(), {
        onScroll: () => {}
    })

    const delegatedProps = computed(() => {
        const { class: _, ...delegated } = props
        return delegated
    })
</script>

<template>
    <ScrollAreaRoot v-bind="delegatedProps" :class="cn('relative overflow-hidden', props.class)">
        <ScrollAreaViewport
            as-child
            class="h-full w-full rounded-[inherit] focus:outline-none"
            @scroll="onScroll"
        >
            <slot></slot>
        </ScrollAreaViewport>
        <ScrollBar />
        <ScrollAreaCorner />
    </ScrollAreaRoot>
</template>
