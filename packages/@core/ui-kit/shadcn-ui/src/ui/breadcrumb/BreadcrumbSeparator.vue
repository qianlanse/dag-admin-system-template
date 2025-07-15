<script setup lang="ts">
    import { cn } from '@dag-core/shared/utils'

    import { ChevronRight } from 'lucide-vue-next'

    const props = defineProps<{ class?: any }>()
</script>

<template>
    <li :class="cn('[&>svg]:size-3.5', props.class)" aria-hidden="true" role="presentation">
        <slot>
            <ChevronRight />
        </slot>
    </li>
</template>
