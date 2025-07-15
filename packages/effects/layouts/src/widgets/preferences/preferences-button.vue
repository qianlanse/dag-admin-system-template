<script setup lang="ts">
    import { Settings } from '@dag/icons'

    import { DagIconButton } from '@dag-core/shadcn-ui'

    import Preferences from './preferences.vue'

    const emit = defineEmits<{ clearPreferencesAndLogout: [] }>()

    /** 清除配置并退出登录 */
    function handleClearPreferencesAndLogout() {
        emit('clearPreferencesAndLogout')
    }
</script>

<template>
    <Preferences @clear-preferences-and-logout="handleClearPreferencesAndLogout">
        <DagIconButton>
            <Settings class="text-foreground size-4" />
        </DagIconButton>
    </Preferences>
</template>
