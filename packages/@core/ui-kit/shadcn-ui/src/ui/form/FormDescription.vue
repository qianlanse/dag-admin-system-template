<script setup lang="ts">
    import { cn } from '@dag-core/shared/utils'

    import { useFormField } from './useFormField'

    const props = defineProps<{ class?: any }>()
    const { formDescriptionId } = useFormField()
</script>

<template>
    <p :id="formDescriptionId" :class="cn('text-muted-foreground text-sm', props.class)">
        <slot></slot>
    </p>
</template>
