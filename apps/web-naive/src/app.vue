<script setup lang="ts">
    import { NConfigProvider } from 'naive-ui'

    defineOptions({ name: 'App' })
</script>

<template>
    <NConfigProvider class="h-full">
        <RouterView />
    </NConfigProvider>
</template>
