<script setup lang="ts">
    import { FormLabel } from '@dag-core/shadcn-ui'
    import { cn } from '@dag-core/shared/utils'

    import { CustomRenderType } from '../types'

    interface Props {
        class?: string
        colon?: boolean
        help?: CustomRenderType
        label?: CustomRenderType
        required?: boolean
    }

    const props = defineProps<Props>()
</script>

<template>
    <FormLabel :class="cn('flex items-center', props.class)">
        <span v-if="required" class="text-destructive mr-[2px]">*</span>
        <slot></slot>
        <span v-if="colon && label">:</span>
    </FormLabel>
</template>
