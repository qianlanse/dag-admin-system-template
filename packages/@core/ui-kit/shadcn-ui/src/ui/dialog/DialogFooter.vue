<script setup lang="ts">
    import { cn } from '@dag-core/shared/utils'

    const props = defineProps<{ class?: any }>()
</script>

<template>
    <div :class="cn('flex justify-end gap-x-2', props.class)">
        <slot></slot>
    </div>
</template>
