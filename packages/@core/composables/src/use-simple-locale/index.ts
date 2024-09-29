import { computed, ref } from 'vue'

import { createSharedComposable } from '@vueuse/core'

import { getMessages, type Locale } from './messages'

/**
 * 使可组合函数可与多个 Vue 实例一起使用
 * @see https://vueuse.org/shared/createSharedComposable/
 */
export const useSimpleLocale = createSharedComposable(() => {
    const currentLocale = ref<Locale>('zh-CN')

    const setSimpleLocale = (locale: Locale) => {
        currentLocale.value = locale
    }

    const $t = computed(() => {
        const localeMessages = getMessages(currentLocale.value)
        return (key: string) => localeMessages[key] || key
    })

    return {
        $t,
        currentLocale,
        setSimpleLocale
    }
})
