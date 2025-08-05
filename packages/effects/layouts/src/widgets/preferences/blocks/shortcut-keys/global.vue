<script setup lang="ts">
    import { computed } from 'vue'

    import { $t } from '@dag/locales'
    import { isWindowsOs } from '@dag/utils'

    import SwitchItem from '../switch-item.vue'

    defineOptions({
        name: 'PreferenceGlobalShortcutKeys'
    })

    const shortcutKeysEnable = defineModel<boolean>('shortcutKeysEnable')
    const shortcutKeysGlobalSearch = defineModel<boolean>('shortcutKeysGlobalSearch')
    const shortcutKeysGlobalLogout = defineModel<boolean>('shortcutKeysGlobalLogout')
    const shortcutKeysGlobalLockScreen = defineModel<boolean>('shortcutKeysGlobalLockScreen')

    const altView = computed(() => (isWindowsOs() ? 'Alt' : '⌥'))
</script>

<template>
    <SwitchItem v-model="shortcutKeysEnable">
        {{ $t('preferences.shortcutKeys.title') }}
    </SwitchItem>
    <SwitchItem v-model="shortcutKeysGlobalSearch" :disabled="!shortcutKeysEnable">
        {{ $t('preferences.shortcutKeys.search') }}
        <template #shortcut>
            {{ isWindowsOs() ? 'Ctrl' : '⌘' }}
            <kbd> K </kbd>
        </template>
    </SwitchItem>
    <SwitchItem v-model="shortcutKeysGlobalLogout" :disabled="!shortcutKeysEnable">
        {{ $t('preferences.shortcutKeys.logout') }}
        <template #shortcut> {{ altView }} Q </template>
    </SwitchItem>
    <SwitchItem v-model="shortcutKeysGlobalLockScreen" :disabled="!shortcutKeysEnable">
        {{ $t('ui.widgets.lockScreen.title') }}
        <template #shortcut> {{ altView }} L </template>
    </SwitchItem>
</template>
