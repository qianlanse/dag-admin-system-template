<script setup lang="ts">
    interface Props {
        width?: string
        height?: string
    }

    withDefaults(defineProps<Props>(), {
        width: '100%',
        height: '300px'
    })
</script>

<template>
    <div v-bind="$attrs" :style="{ width, height }"></div>
</template>
