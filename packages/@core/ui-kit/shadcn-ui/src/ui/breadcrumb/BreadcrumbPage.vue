<script setup lang="ts">
    import { cn } from '@dag-core/shared/utils'

    const props = defineProps<{ class?: any }>()
</script>

<template>
    <span
        :class="cn('text-foreground font-normal', props.class)"
        aria-current="page"
        aria-disabled="true"
        role="link"
    >
        <slot></slot>
    </span>
</template>
