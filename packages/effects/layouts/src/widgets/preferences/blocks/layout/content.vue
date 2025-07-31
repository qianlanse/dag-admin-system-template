<script setup lang="ts">
    import type { Component } from 'vue'

    import { computed } from 'vue'

    import { $t } from '@dag/locales'

    import { ContentCompact, ContentWide } from '../../icons'

    defineOptions({
        name: 'PreferenceLayoutContent'
    })

    const modelValue = defineModel<string>({ default: 'wide' })

    const PRESET = computed(() => [
        {
            name: $t('preferences.wide'),
            type: 'wide'
        },
        {
            name: $t('preferences.compact'),
            type: 'compact'
        }
    ])

    const components: Record<string, Component> = {
        compact: ContentCompact,
        wide: ContentWide
    }

    function activeClass(theme: string): string[] {
        return theme === modelValue.value ? ['outline-box-active'] : []
    }
</script>

<template>
    <div class="flex w-full gap-5">
        <template v-for="item in PRESET" :key="item.name">
            <div class="flex w-[100px] cursor-pointer flex-col" @click="modelValue = item.type">
                <div :class="activeClass(item.type)" class="outline-box flex-center">
                    <component :is="components[item.type]" />
                </div>
                <div class="text-muted-foreground mt-2 text-center text-xs">
                    {{ item.name }}
                </div>
            </div>
        </template>
    </div>
</template>
