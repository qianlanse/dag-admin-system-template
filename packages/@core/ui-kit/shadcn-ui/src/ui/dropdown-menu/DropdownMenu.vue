<script setup lang="ts">
    import type { DropdownMenuRootEmits, DropdownMenuRootProps } from 'radix-vue'

    import { DropdownMenuRoot, useForwardPropsEmits } from 'radix-vue'

    const props = withDefaults(defineProps<DropdownMenuRootProps>(), {
        modal: false
    })
    const emits = defineEmits<DropdownMenuRootEmits>()

    /**
     * 此可组合项只是useForwardProps和useEmitAsProps可组合项的包装器。这样做只会返回 1 个旨在直接与v-bind一起使用的对象
     */
    const forwarded = useForwardPropsEmits(props, emits)
</script>

<template>
    <DropdownMenuRoot v-bind="forwarded">
        <slot></slot>
    </DropdownMenuRoot>
</template>
