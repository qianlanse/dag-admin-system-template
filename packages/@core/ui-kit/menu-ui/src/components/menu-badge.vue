<script setup lang="ts">
    import type { MenuRecordBadgeRaw } from '@dag-core/typings'

    import { computed } from 'vue'

    interface Props extends MenuRecordBadgeRaw {
        hasChildren?: boolean
    }

    const props = defineProps<Props>()

    const isDot = computed(() => props.badgeType === 'dot')
</script>

<template>
    <span v-if="isDot || badge" :class="$attrs.class" class="absolute">menu-badge</span>
</template>
