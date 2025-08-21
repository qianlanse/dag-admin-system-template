<script setup lang="ts">
    import { ChevronDown } from '@dag-core/icons'
    import { cn } from '@dag-core/shared/utils'

    const props = defineProps<{ class?: any }>()

    const collapsed = defineModel<boolean>({ default: false })
</script>

<template>
    <div
        :class="cn('dag-link inline-flex items-center', props.class)"
        @click="collapsed = !collapsed"
    >
        <slot :is-expanded="collapsed">
            {{ collapsed }}
        </slot>
        <div :class="{ 'rotate-180': !collapsed }" class="transition-transform duration-300">
            <slot name="icon">
                <ChevronDown class="size-4" />
            </slot>
        </div>
    </div>
</template>
