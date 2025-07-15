<script setup lang="ts">
    import type { ThemeModeType } from '@dag/types'

    import { MoonStar, Sun, SunMoon } from '@dag/icons'
    import { $t } from '@dag/locales'
    import { preferences, updatePreferences, usePreferences } from '@dag/preferences'

    import { DagTooltip, ToggleGroup, ToggleGroupItem } from '@dag-core/shadcn-ui'

    import ThemeButton from './theme-button.vue'

    defineOptions({
        name: 'ThemeToggle'
    })

    withDefaults(defineProps<{ shouldOnHover?: boolean }>(), {
        shouldOnHover: false
    })

    const { isDark } = usePreferences()

    const PRESETS = [
        {
            icon: Sun,
            name: 'light',
            title: $t('preferences.theme.light')
        },
        {
            icon: MoonStar,
            name: 'dark',
            title: $t('preferences.theme.dark')
        },
        {
            icon: SunMoon,
            name: 'auto',
            title: $t('preferences.followSystem')
        }
    ]

    function handleUpdateTheme(isDark: boolean | undefined) {
        updatePreferences({
            theme: {
                mode: isDark ? 'dark' : 'light'
            }
        })
    }

    function handleUpdateThemeMode(val: string | string[]) {
        updatePreferences({
            theme: {
                mode: val as ThemeModeType
            }
        })
    }
</script>

<template>
    <div>
        <DagTooltip :disabled="!shouldOnHover" side="bottom">
            <template #trigger>
                <ThemeButton
                    :model-value="isDark"
                    type="icon"
                    @update:model-value="handleUpdateTheme"
                />
            </template>
            <ToggleGroup
                :model-value="preferences.theme.mode"
                class="gap-2"
                type="single"
                variant="outline"
                @update:model-value="handleUpdateThemeMode"
            >
                <ToggleGroupItem v-for="item in PRESETS" :key="item.name" :value="item.name">
                    <component :is="item.icon" :title="item.name" class="size-5" />
                </ToggleGroupItem>
            </ToggleGroup>
        </DagTooltip>
    </div>
</template>
