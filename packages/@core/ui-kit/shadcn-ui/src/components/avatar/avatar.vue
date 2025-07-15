<script setup lang="ts">
    import type { AvatarFallbackProps, AvatarImageProps, AvatarRootProps } from 'radix-vue'

    import type { CSSProperties } from 'vue'

    import type { ClassType } from '@dag-core/typings'

    import { computed } from 'vue'

    import { Avatar, AvatarFallback, AvatarImage } from '../../ui'

    interface Props extends AvatarFallbackProps, AvatarImageProps, AvatarRootProps {
        alt?: string
        class?: ClassType
        dot?: boolean
        dotClass?: ClassType
        size?: number
    }

    defineOptions({
        inheritAttrs: false
    })

    const props = withDefaults(defineProps<Props>(), {
        alt: 'avatar',
        as: 'button',
        dot: false,
        dotClass: 'bg-green-500'
    })

    const text = computed(() => props.alt.slice(-2).toUpperCase())

    const rootStyle = computed((): CSSProperties => {
        return props.size !== undefined && props.size > 0
            ? {
                  height: `${props.size}px`,
                  width: `${props.size}px`
              }
            : {}
    })
</script>

<template>
    <div :class="props.class" :style="rootStyle" class="relative flex flex-shrink-0 items-center">
        <Avatar :class="props.class" class="size-full">
            <AvatarImage :alt="alt" :src="src" />
            <AvatarFallback>{{ text }}</AvatarFallback>
        </Avatar>
    </div>
</template>
