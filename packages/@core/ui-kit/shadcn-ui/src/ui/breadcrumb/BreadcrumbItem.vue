<script setup lang="ts">
    import { cn } from '@dag-core/shared/utils'

    const props = defineProps<{ class?: any }>()
</script>

<template>
    <li :class="cn('hover:text-foreground inline-flex items-center gap-1.5', props.class)">
        <slot></slot>
    </li>
</template>
