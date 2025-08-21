<script setup lang="ts">
    import type { CSSProperties } from 'vue'

    defineProps<{
        dotClass?: string
        dotStyle?: CSSProperties
    }>()
</script>

<template>
    <span class="relative mr-1 flex size-1.5">
        <span
            :class="dotClass"
            :style="dotStyle"
            class="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
        ></span>
        <span
            :class="dotClass"
            :style="dotStyle"
            class="relative inline-flex h-full w-full rounded-full"
        ></span>
    </span>
</template>
