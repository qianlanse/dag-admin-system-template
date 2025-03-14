<script setup lang="ts">
    import type { DropdownMenuTriggerProps } from 'radix-vue'

    import { DropdownMenuTrigger, useForwardProps } from 'radix-vue'

    const props = defineProps<DropdownMenuTriggerProps>()

    const forwarded = useForwardProps(props)
</script>

<template>
    <DropdownMenuTrigger v-bind="forwarded">
        <slot></slot>
    </DropdownMenuTrigger>
</template>
