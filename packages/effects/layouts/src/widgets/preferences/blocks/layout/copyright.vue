<script setup lang="ts">
    import { computed } from 'vue'

    import { $t } from '@dag/locales'

    import InputItem from '../input-item.vue'
    import SwitchItem from '../switch-item.vue'

    const props = defineProps<{ disabled?: boolean }>()

    const copyrightEnable = defineModel<boolean>('copyrightEnable')
    const copyrightCompanyName = defineModel<string>('copyrightCompanyName')
    const copyrightCompanySiteLink = defineModel<string>('copyrightCompanySiteLink')
    const copyrightDate = defineModel<string>('copyrightDate')
    const copyrightIcp = defineModel<string>('copyrightIcp')
    const copyrightIcpLink = defineModel<string>('copyrightIcpLink')

    const itemDisabled = computed(() => props.disabled || !copyrightEnable.value)
</script>

<template>
    <SwitchItem v-model="copyrightEnable" :disabled="disabled">
        {{ $t('preferences.copyright.enable') }}
    </SwitchItem>
    <InputItem
        v-model="copyrightCompanyName"
        :placeholder="$t('preferences.copyright.companyName')"
        :disabled="itemDisabled"
    >
        {{ $t('preferences.copyright.companyName') }}
    </InputItem>
    <InputItem
        v-model="copyrightCompanySiteLink"
        :placeholder="$t('preferences.copyright.companySiteLink')"
        :disabled="itemDisabled"
    >
        {{ $t('preferences.copyright.companySiteLink') }}
    </InputItem>
    <InputItem
        v-model="copyrightDate"
        :placeholder="$t('preferences.copyright.date')"
        :disabled="itemDisabled"
    >
        {{ $t('preferences.copyright.date') }}
    </InputItem>
    <InputItem
        v-model="copyrightIcp"
        :placeholder="$t('preferences.copyright.icp')"
        :disabled="itemDisabled"
    >
        {{ $t('preferences.copyright.icp') }}
    </InputItem>
    <InputItem
        v-model="copyrightIcpLink"
        :placeholder="$t('preferences.copyright.icpLink')"
        :disabled="itemDisabled"
    >
        {{ $t('preferences.copyright.icpLink') }}
    </InputItem>
</template>
