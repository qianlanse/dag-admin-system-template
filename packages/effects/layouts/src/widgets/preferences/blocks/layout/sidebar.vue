<script setup lang="ts">
    import type { LayoutType } from '@dag/types'

    import { computed, onMounted } from 'vue'

    import { $t } from '@dag/locales'

    import CheckboxItem from '../checkbox-item.vue'
    import NumberFiedlItem from '../number-field-item.vue'
    import SwitchItem from '../switch-item.vue'

    const props = defineProps<{ currentLayout?: LayoutType; disabled: boolean }>()

    const sidebarEnable = defineModel<boolean>('sidebarEnable')
    const sidebarCollapsed = defineModel<boolean>('sidebarCollapsed')
    const sidebarExpandOnHover = defineModel<boolean>('sidebarExpandOnHover')
    const sidebarCollapsedShowTitle = defineModel<boolean>('sidebarCollapsedShowTitle')
    const sidebarAutoActivateChild = defineModel<boolean>('sidebarAutoActivateChild')

    const sidebarButtons = defineModel<string[]>('sidebarButtons', { default: [] })
    const sidebarCollapsedButton = defineModel<boolean>('sidebarCollapsedButton')
    const sidebarFixedButton = defineModel<boolean>('sidebarFixedButton')

    const sidebarWidth = defineModel<number>('sidebarWidth')

    const notMixedLayout = computed(
        () =>
            !['header-mixed-nav', 'mixed-nav', 'sidebar-mixed-nav'].includes(
                props.currentLayout as string
            )
    )

    onMounted(() => {
        if (sidebarCollapsedButton.value && !sidebarButtons.value.includes('collapsed')) {
            sidebarButtons.value.push('collapsed')
        }

        if (sidebarFixedButton.value && !sidebarButtons.value.includes('fixed')) {
            sidebarButtons.value.push('fixed')
        }
    })

    /** 复选框改变时 */
    function handleCheckboxChange() {
        sidebarCollapsedButton.value = !!sidebarButtons.value.includes('collapsed')
        sidebarFixedButton.value = !!sidebarButtons.value.includes('fixed')
    }
</script>

<template>
    <SwitchItem v-model="sidebarEnable" :disabled="disabled">
        {{ $t('preferences.sidebar.visible') }}
    </SwitchItem>
    <SwitchItem v-model="sidebarCollapsed" :disabled="!sidebarEnable || disabled">
        {{ $t('preferences.sidebar.collapsed') }}
    </SwitchItem>
    <SwitchItem
        v-model="sidebarExpandOnHover"
        :disabled="!sidebarEnable || disabled || !sidebarCollapsed"
        :tip="$t('preferences.sidebar.expandOnHoverTip')"
    >
        {{ $t('preferences.sidebar.expandOnHover') }}
    </SwitchItem>
    <SwitchItem v-model="sidebarCollapsedShowTitle">
        {{ $t('preferences.sidebar.collapsedShowTitle') }}
    </SwitchItem>
    <SwitchItem
        v-model="sidebarAutoActivateChild"
        :disabled="!sidebarEnable || disabled || notMixedLayout"
        :tip="$t('preferences.sidebar.autoActivateChildTip')"
    >
        {{ $t('preferences.sidebar.autoActivateChild') }}
    </SwitchItem>
    <CheckboxItem
        v-model="sidebarButtons"
        :items="[
            { label: $t('preferences.sidebar.buttonCollapsed'), value: 'collapsed' },
            { label: $t('preferences.sidebar.buttonFixed'), value: 'fixed' }
        ]"
        multiple
        :on-btn-click="handleCheckboxChange"
    >
        {{ $t('preferences.sidebar.buttons') }}
    </CheckboxItem>
    <NumberFiedlItem
        v-model="sidebarWidth"
        :disabled="!sidebarEnable || disabled"
        :max="320"
        :min="160"
        :step="10"
    >
        {{ $t('preferences.sidebar.width') }}
    </NumberFiedlItem>
</template>
