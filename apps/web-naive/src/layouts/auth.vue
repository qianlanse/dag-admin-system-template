<script setup lang="ts">
    import { computed } from 'vue'

    import { AuthPageLayout } from '@dag/layouts'
    import { preferences } from '@dag/preferences'

    import { $t } from '#/locales'

    const appName = computed(() => preferences.app.name)
    const logo = computed(() => preferences.logo.source)
</script>

<template>
    <AuthPageLayout
        :app-name="appName"
        :logo="logo"
        :page-description="$t('authentication.pageDesc')"
        :page-title="$t('authentication.pageTitle')"
    />
</template>
