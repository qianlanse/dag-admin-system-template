<script setup lang="ts">
    import type { CSSProperties } from 'vue'

    import { computed } from 'vue'

    interface Props {
        height: number
    }

    const props = withDefaults(defineProps<Props>(), {})

    const style = computed((): CSSProperties => {
        const { height } = props
        return { height: `${height}px` }
    })
</script>

<template>
    <section :style="style" class="border-border bg-background flex w-full border-b transition-all">
        <slot></slot>
    </section>
</template>
