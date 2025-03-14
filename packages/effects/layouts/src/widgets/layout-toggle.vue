<script setup lang="ts">
    import type { AuthPageLayoutType } from '@dag/types'

    import type { DagDropdownMenuItem } from '@dag-core/shadcn-ui'

    import { computed } from 'vue'

    import { InspectionPanel, PanelLeft, PanelRight } from '@dag/icons'
    import { $t } from '@dag/locales'
    import { preferences, updatePreferences, usePreferences } from '@dag/preferences'

    import { DagDropdownRadioMenu, DagIconButton } from '@dag-core/shadcn-ui'

    defineOptions({
        name: 'AuthenticationLayoutToggle'
    })

    const { authPanelCenter, authPanelLeft, authPanelRight } = usePreferences()

    const menus = computed((): DagDropdownMenuItem[] => [
        {
            icon: PanelLeft,
            label: $t('authentication.layout.alignLeft'),
            value: 'panel-left'
        },
        {
            icon: InspectionPanel,
            label: $t('authentication.layout.center'),
            value: 'panel-center'
        },
        {
            icon: PanelRight,
            label: $t('authentication.layout.alignRight'),
            value: 'panel-right'
        }
    ])

    function handleUpdate(value: string) {
        updatePreferences({
            app: {
                authPageLayout: value as AuthPageLayoutType
            }
        })
    }
</script>

<template>
    <DagDropdownRadioMenu
        :menus="menus"
        :model-value="preferences.app.authPageLayout"
        @update:model-value="handleUpdate"
    >
        <DagIconButton>
            <PanelRight v-if="authPanelRight" class="size-4" />
            <PanelLeft v-if="authPanelLeft" class="size-4" />
            <InspectionPanel v-if="authPanelCenter" class="size-4" />
        </DagIconButton>
    </DagDropdownRadioMenu>
</template>
