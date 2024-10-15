<script setup lang="ts">
    import type { SupportedLanguagesType } from '@dag/preferences'

    import { SUPPORT_LANGUAGES } from '@dag/constants'
    import { Languages } from '@dag/icons'
    import { loadLocaleMessages } from '@dag/locales'
    import { preferences, updatePreferences } from '@dag/preferences'
    import { DagDropdownRadioMenu, DagIconButton } from '@dag-core/shadcn-ui'

    defineOptions({
        name: 'LanguageToggle'
    })

    function handleUpdate(value: string) {
        const locale = value as SupportedLanguagesType
        updatePreferences({
            app: {
                locale
            }
        })
        loadLocaleMessages(locale)
    }
</script>

<template>
    <div>
        <DagDropdownRadioMenu
            :menus="SUPPORT_LANGUAGES"
            :model-value="preferences.app.locale"
            @update:model-value="handleUpdate"
        >
            <DagIconButton>
                <Languages class="text-foreground size-4" />
            </DagIconButton>
        </DagDropdownRadioMenu>
    </div>
</template>
