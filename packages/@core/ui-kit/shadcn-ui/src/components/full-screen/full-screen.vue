<script setup lang="ts">
    import { useFullscreen } from '@vueuse/core'
    import { Maximize, Minimize } from 'lucide-vue-next'

    import { DagIconButton } from '../button'

    const { isFullscreen, toggle } = useFullscreen()

    // 重新检查全屏状态
    isFullscreen.value = !!(
        document.fullscreenElement ||
        // @ts-ignore
        document.webkitFullscreenElement ||
        // @ts-ignore
        document.mozFullScreenElement ||
        // @ts-ignore
        document.msFullscreenElement
    )
</script>

<template>
    <DagIconButton @click="toggle">
        <Minimize v-if="isFullscreen" class="text-foreground size-4" />
        <Maximize v-else class="text-foreground size-4" />
    </DagIconButton>
</template>
