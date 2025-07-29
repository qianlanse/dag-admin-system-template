import { computed } from 'vue'

import { preferences } from '@dag/preferences'

import { createDiscreteApi, darkTheme, lightTheme } from 'naive-ui'

const themeOverridesProviderProps = computed(() => ({
    themeOverrides: preferences.theme.mode === 'light' ? lightTheme : darkTheme
}))

export const { message } = createDiscreteApi(['message'], {
    messageProviderProps: themeOverridesProviderProps
})
