<script setup lang="ts">
    import type { SelectOption } from '@dag/types'

    import { computed } from 'vue'

    import { $t } from '@dag/locales'

    import SwitchItem from '../switch-item.vue'
    import ToggleItem from '../toggle-item.vue'

    defineOptions({
        name: 'PreferenceBreadcrumbConfig'
    })

    const props = defineProps<{ disabled?: boolean }>()

    const breadcrumbEnable = defineModel<boolean>('breadcrumbEnable')
    const breadcrumbHideOnlyOne = defineModel<boolean>('breadcrumbHideOnlyOne')
    const breadcrumbShowIcon = defineModel<boolean>('breadcrumbShowIcon')
    const breadcrumbShowHome = defineModel<boolean>('breadcrumbShowHome')
    const breadcrumbStyleType = defineModel<string>('breadcrumbStyleType')

    const typeItems: SelectOption[] = [
        { label: $t('preferences.normal'), value: 'normal' },
        { label: $t('preferences.breadcrumb.background'), value: 'background' }
    ]

    const disableItem = computed(() => !breadcrumbEnable.value || props.disabled)
</script>

<template>
    <SwitchItem v-model="breadcrumbEnable" :disabled="disabled">
        {{ $t('preferences.breadcrumb.enable') }}
    </SwitchItem>
    <SwitchItem v-model="breadcrumbHideOnlyOne" :disabled="disableItem">
        {{ $t('preferences.breadcrumb.hideOnlyOne') }}
    </SwitchItem>
    <SwitchItem v-model="breadcrumbShowIcon" :disabled="disableItem">
        {{ $t('preferences.breadcrumb.icon') }}
    </SwitchItem>
    <SwitchItem v-model="breadcrumbShowHome" :disabled="disableItem || !breadcrumbShowIcon">
        {{ $t('preferences.breadcrumb.home') }}
    </SwitchItem>
    <ToggleItem v-model="breadcrumbStyleType" :disabled="disableItem" :items="typeItems">
        {{ $t('preferences.breadcrumb.style') }}
    </ToggleItem>
</template>
