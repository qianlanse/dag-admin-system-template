<script setup lang="ts">
    import { computed } from 'vue'

    import { Settings } from '@dag/icons'
    import { $t, loadLocaleMessages } from '@dag/locales'
    import { preferences, updatePreferences } from '@dag/preferences'
    import { capitalizeFirstLetter } from '@dag/utils'

    import { useDagDrawer } from '@dag-core/popup-ui'
    import { DagButton } from '@dag-core/shadcn-ui'

    import PreferencesDrawer from './preferences-drawer.vue'

    const [Drawer, drawerApi] = useDagDrawer({
        connectedComponent: PreferencesDrawer
    })

    /**
     * preferences 转成 vue props
     * preferences.widget.fullscreen=>widgetFullscreen
     */
    const attrs = computed(() => {
        const result: Record<string, any> = {}
        for (const [key, value] of Object.entries(preferences)) {
            for (const [subKey, subValue] of Object.entries(value)) {
                result[`${key}${capitalizeFirstLetter(subKey)}`] = subValue
            }
        }
        return result
    })

    /**
     * preferences 转成 vue listener
     * preferences.widget.fullscreen=>@update:widgetFullscreen
     */
    const listen = computed(() => {
        const result: Record<string, any> = {}

        for (const [key, value] of Object.entries(preferences)) {
            if (typeof value === 'object') {
                for (const subKey of Object.keys(value)) {
                    result[`update:${key}${capitalizeFirstLetter(subKey)}`] = (val: any) => {
                        updatePreferences({ [key]: { [subKey]: val } })
                        if (key === 'app' && subKey === 'locale') {
                            loadLocaleMessages(val)
                        }
                    }
                }
            } else {
                result[key] = value
            }
        }

        return result
    })
</script>

<template>
    <div>
        <Drawer v-bind="{ ...$attrs, ...attrs }" v-on="listen" />
        <div @click="() => drawerApi.open()">
            <slot>
                <DagButton
                    :title="$t('preferences.title')"
                    class="bg-primary flex-col-center size-10 cursor-pointer rounded-l-lg rounded-r-none border-none"
                >
                    <Settings class="size-5" />
                </DagButton>
            </slot>
        </div>
    </div>
</template>
