<script setup lang="ts">
    import { provide, useId } from 'vue'

    import { cn } from '@dag-core/shared/utils'

    import { FORM_ITEM_INJECTION_KEY } from './injectionKeys'

    const props = defineProps<{ class?: any }>()
    const id = useId()

    provide(FORM_ITEM_INJECTION_KEY, id)
</script>

<template>
    <div :class="cn(props.class)">
        <slot></slot>
    </div>
</template>
