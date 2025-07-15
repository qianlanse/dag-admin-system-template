<script setup lang="ts">
    import { Pin, PinOff } from '@dag-core/icons'

    const expandOnHover = defineModel<boolean>('expandOnHover')
</script>

<template>
    <div
        @click="expandOnHover = !expandOnHover"
        class="flex-center hover:text-foreground text-foreground/60 hover:bg-accent-hover bg-accent absolute bottom-2 right-3 z-10 cursor-pointer rounded-sm p-[5px] transition-all duration-300"
    >
        <Pin v-if="expandOnHover" class="size-3.5" />
        <PinOff v-else class="size-3.5" />
    </div>
</template>
