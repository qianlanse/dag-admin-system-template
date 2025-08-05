<script setup lang="ts">
    import type { PreferencesButtonPositionType, SelectOption } from '@dag/types'

    import { computed } from 'vue'

    import { $t } from '@dag/locales'

    import SelectItem from '../select-item.vue'
    import SwitchItem from '../switch-item.vue'

    const widgetGlobalSearch = defineModel<boolean>('widgetGlobalSearch')
    const widgetThemeToggle = defineModel<boolean>('widgetThemeToggle')
    const widgetLanguageToggle = defineModel<boolean>('widgetLanguageToggle')
    const widgetFullscreen = defineModel<boolean>('widgetFullscreen')
    const widgetNotification = defineModel<boolean>('widgetNotification')
    const widgetLockScreen = defineModel<boolean>('widgetLockScreen')
    const widgetSidebarToggle = defineModel<boolean>('widgetSidebarToggle')
    const widgetRefresh = defineModel<boolean>('widgetRefresh')
    const appPreferencesButtonPosition = defineModel<PreferencesButtonPositionType>(
        'appPreferencesButtonPosition'
    )

    const positionItems = computed((): SelectOption[] => [
        {
            label: $t('preferences.position.auto'),
            value: 'auto'
        },
        {
            label: $t('preferences.position.header'),
            value: 'header'
        },
        {
            label: $t('preferences.position.fixed'),
            value: 'fixed'
        }
    ])
</script>

<template>
    <SwitchItem v-model="widgetGlobalSearch">
        {{ $t('preferences.widget.globalSearch') }}
    </SwitchItem>
    <SwitchItem v-model="widgetThemeToggle">
        {{ $t('preferences.widget.themeToggle') }}
    </SwitchItem>
    <SwitchItem v-model="widgetLanguageToggle">
        {{ $t('preferences.widget.languageToggle') }}
    </SwitchItem>
    <SwitchItem v-model="widgetFullscreen">
        {{ $t('preferences.widget.fullscreen') }}
    </SwitchItem>
    <SwitchItem v-model="widgetNotification">
        {{ $t('preferences.widget.notification') }}
    </SwitchItem>
    <SwitchItem v-model="widgetLockScreen">
        {{ $t('preferences.widget.lockScreen') }}
    </SwitchItem>
    <SwitchItem v-model="widgetSidebarToggle">
        {{ $t('preferences.widget.sidebarToggle') }}
    </SwitchItem>
    <SwitchItem v-model="widgetRefresh">
        {{ $t('preferences.widget.refresh') }}
    </SwitchItem>
    <SelectItem v-model="appPreferencesButtonPosition" :items="positionItems">
        {{ $t('preferences.position.title') }}
    </SelectItem>
</template>
