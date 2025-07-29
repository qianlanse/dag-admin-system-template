<script setup lang="ts">
    import type { BuiltinThemeType, ThemeModeType } from '@dag/types'

    import type { SegmentedItem } from '@dag-core/shadcn-ui'

    import { computed, ref } from 'vue'

    import { Copy, RotateCw } from '@dag/icons'
    import { $t, loadLocaleMessages } from '@dag/locales'
    import {
        clearPreferencesCache,
        preferences,
        resetPreferences,
        usePreferences
    } from '@dag/preferences'

    import { useDagDrawer } from '@dag-core/popup-ui'
    import { DagButton, DagIconButton, DagSegmented } from '@dag-core/shadcn-ui'
    import { globalShareState } from '@dag-core/shared/global-state'

    import { useClipboard } from '@vueuse/core'

    import { Block, BuiltinTheme, ColorMode, Radius, Theme } from '../blocks'

    const emit = defineEmits<{ clearPreferencesAndLogout: [] }>()

    const message = globalShareState.getMessage()

    const { diffPreference, isDark } = usePreferences()
    const { copy } = useClipboard({ legacy: true })
    const [Drawer] = useDagDrawer()

    const activeTab = ref('appearance')

    const themeMode = defineModel<ThemeModeType>('themeMode')
    const themeSemiDarkSidebar = defineModel<boolean>('themeSemiDarkSidebar')
    const themeSemiDarkHeader = defineModel<boolean>('themeSemiDarkHeader')
    const themeBuiltinType = defineModel<BuiltinThemeType>('themeBuiltinType')
    const themeColorPrimary = defineModel<string>('themeColorPrimary')
    const themeRadius = defineModel<string>('themeRadius')
    const appColorWeakMode = defineModel<boolean>('appColorWeakMode')
    const appColorGrayMode = defineModel<boolean>('appColorGrayMode')

    const tabs = computed((): SegmentedItem[] => {
        return [
            {
                label: $t('preferences.appearance'),
                value: 'appearance'
            },
            {
                label: $t('preferences.layout'),
                value: 'layout'
            },
            {
                label: $t('preferences.shortcutKeys.title'),
                value: 'shortcutKey'
            },
            {
                label: $t('preferences.general'),
                value: 'general'
            }
        ]
    })

    /** 重置 */
    async function handleReset() {
        if (!diffPreference.value) {
            return
        }
        resetPreferences()
        await loadLocaleMessages(preferences.app.locale)
    }

    /** 复制改变的值 */
    async function handleCopy() {
        await copy(JSON.stringify(diffPreference.value, null, 2))

        message.copyPreferencesSuccess?.(
            $t('preferences.copyPreferencesSuccessTitle'),
            $t('preferences.copyPreferencesSuccess')
        )
    }

    /** 清除缓存退出登录 */
    function handleClearCache() {
        resetPreferences()
        clearPreferencesCache()
        emit('clearPreferencesAndLogout')
    }
</script>

<template>
    <div>
        <Drawer
            :description="$t('preferences.subtitle')"
            :title="$t('preferences.title')"
            class="sm:max-w-sm"
        >
            <template #extra>
                <div class="flex items-center">
                    <DagIconButton
                        :disabled="!diffPreference"
                        :tooltip="$t('preferences.resetTip')"
                        class="relative"
                    >
                        <span
                            v-if="diffPreference"
                            class="bg-primary absolute right-0.5 top-0.5 h-2 w-2 rounded"
                        ></span>
                        <RotateCw class="size-4" @click="handleReset" />
                    </DagIconButton>
                </div>
            </template>

            <div class="p-1">
                <DagSegmented v-model="activeTab" :tabs="tabs">
                    <template #appearance>
                        <Block :title="$t('preferences.theme.title')">
                            <Theme
                                v-model="themeMode"
                                v-model:theme-semi-dark-header="themeSemiDarkHeader"
                                v-model:theme-semi-dark-sidebar="themeSemiDarkSidebar"
                            />
                        </Block>
                        <Block :title="$t('preferences.theme.builtin.title')">
                            <BuiltinTheme
                                v-model="themeBuiltinType"
                                v-model:theme-color-primary="themeColorPrimary"
                                :is-dark="isDark"
                            />
                        </Block>
                        <Block :title="$t('preferences.theme.radius')">
                            <Radius v-model="themeRadius" />
                        </Block>
                        <Block :title="$t('preferences.other')">
                            <ColorMode
                                v-model:app-color-weak-mode="appColorWeakMode"
                                v-model:app-color-gray-mode="appColorGrayMode"
                            />
                        </Block>
                    </template>
                    <template #layout>
                        <span>layout</span>
                    </template>
                    <template #shortcutKey>
                        <span>shortcutKey</span>
                    </template>
                    <template #general>
                        <span>general</span>
                    </template>
                </DagSegmented>
            </div>

            <template #footer>
                <DagButton
                    :disabled="!diffPreference"
                    class="mx-4 w-full"
                    size="sm"
                    variant="default"
                    @click="handleCopy"
                >
                    <Copy class="mr-2 size-3" />
                    {{ $t('preferences.copyPreferences') }}
                </DagButton>
                <DagButton
                    :disabled="!diffPreference"
                    class="mr-4 w-full"
                    size="sm"
                    variant="ghost"
                    @click="handleClearCache"
                >
                    {{ $t('preferences.clearAndLogout') }}
                </DagButton>
            </template>
        </Drawer>
    </div>
</template>
