<script setup lang="ts">
    import type { ClassType } from '@dag-core/typings'

    import type { AvatarVariants } from './avatar'

    import { cn } from '@dag-core/shared/utils'

    import { AvatarRoot } from 'radix-vue'

    import { avatarVariant } from './avatar'

    interface Props {
        class?: ClassType
        shape?: AvatarVariants['shape']
        size?: AvatarVariants['size']
    }

    const props = withDefaults(defineProps<Props>(), {
        shape: 'circle',
        size: 'sm'
    })
</script>

<template>
    <AvatarRoot :class="cn(avatarVariant({ size, shape }), props.class)">
        <slot></slot>
    </AvatarRoot>
</template>
