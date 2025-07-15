<script setup lang="ts">
    import { DagAvatar } from '../avatar'

    interface Props {
        /** 是否折叠文本 */
        collapsed?: boolean
        /** 跳转地址 */
        href?: string
        /** 图片大小 */
        logoSize?: number
        /** 图标地址 */
        src?: string
        /** 文本 */
        text: string
        /** 主题 */
        theme?: string
    }

    defineOptions({
        name: 'DagLogo'
    })

    withDefaults(defineProps<Props>(), {
        collapsed: false,
        href: 'javascript:void 0',
        logoSize: 32,
        src: '',
        theme: 'light'
    })
</script>

<template>
    <div :class="theme" class="flex h-full items-center text-lg">
        <a
            :class="$attrs.class"
            :href="href"
            class="flex h-full items-center gap-2 overflow-hidden px-3 text-lg leading-normal transition-all duration-500"
        >
            <DagAvatar
                v-if="src"
                :alt="text"
                :src="src"
                :size="logoSize"
                class="relative rounded-none bg-transparent"
            />
            <template v-if="!collapsed">
                <slot name="text">
                    <span class="text-foreground truncate text-nowrap font-semibold">
                        {{ text }}
                    </span>
                </slot>
            </template>
        </a>
    </div>
</template>
