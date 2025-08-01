<script setup lang="ts">
    import type { Component } from 'vue'

    import type { LayoutType } from '@dag/types'

    import { computed } from 'vue'

    import { CircleHelp } from '@dag/icons'
    import { $t } from '@dag/locales'

    import { DagTooltip } from '@dag-core/shadcn-ui'

    import {
        FullContent,
        HeaderMixedNav,
        HeaderNav,
        HeaderSidebarNav,
        MixedNav,
        SidebarMixedNav,
        SidebarNav
    } from '../../icons'

    interface PresetItem {
        name: string
        tip: string
        type: LayoutType
    }

    defineOptions({
        name: 'PreferenceLayout'
    })

    const components: Record<LayoutType, Component> = {
        'sidebar-mixed-nav': SidebarMixedNav,
        'sidebar-nav': SidebarNav,
        'header-nav': HeaderNav,
        'header-sidebar-nav': HeaderSidebarNav,
        'mixed-nav': MixedNav,
        'header-mixed-nav': HeaderMixedNav,
        'full-content': FullContent
    }

    const PRESET = computed((): PresetItem[] => [
        {
            name: $t('preferences.vertical'),
            tip: $t('preferences.verticalTip'),
            type: 'sidebar-nav'
        },
        {
            name: $t('preferences.twoColumn'),
            tip: $t('preferences.twoColumnTip'),
            type: 'sidebar-mixed-nav'
        },
        {
            name: $t('preferences.horizontal'),
            tip: $t('preferences.horizontalTip'),
            type: 'header-nav'
        },
        {
            name: $t('preferences.headerSidebarNav'),
            tip: $t('preferences.headerSidebarNavTip'),
            type: 'header-sidebar-nav'
        },
        {
            name: $t('preferences.mixedMenu'),
            tip: $t('preferences.mixedMenuTip'),
            type: 'mixed-nav'
        },
        {
            name: $t('preferences.headerTwoColumn'),
            tip: $t('preferences.headerTwoColumnTip'),
            type: 'header-mixed-nav'
        },
        {
            name: $t('preferences.fullContent'),
            tip: $t('preferences.fullContentTip'),
            type: 'full-content'
        }
    ])

    const modelValue = defineModel<LayoutType>({ default: 'sidebar-nav' })

    function activeClass(theme: string): string[] {
        return theme === modelValue.value ? ['outline-box-active'] : []
    }
</script>

<template>
    <div class="flex w-full flex-wrap gap-4">
        <template v-for="layout in PRESET" :key="layout.name">
            <div class="flex w-[100px] cursor-pointer flex-col" @click="modelValue = layout.type">
                <div :class="activeClass(layout.type)" class="outline-box flex-center">
                    <component :is="components[layout.type]" />
                </div>
                <div
                    class="text-muted-foreground flex-center hover:text-foreground mt-2 text-center text-xs"
                >
                    {{ layout.name }}
                    <DagTooltip v-if="layout.tip" side="bottom">
                        <template #trigger>
                            <CircleHelp class="ml-1 size-3 cursor-help" />
                        </template>
                        {{ layout.tip }}
                    </DagTooltip>
                </div>
            </div>
        </template>
    </div>
</template>
