<script setup lang="ts">
    import { computed, useSlots } from 'vue'

    import { useRefresh } from '@dag/hooks'
    import { RotateCw } from '@dag/icons'
    import { preferences, usePreferences } from '@dag/preferences'
    import { useAccessStore } from '@dag/stores'

    import { DagFullScreen, DagIconButton } from '@dag-core/shadcn-ui'

    import { GlobalSearch, LanguageToggle, PreferencesButton, ThemeToggle } from '../../widgets'

    defineOptions({
        name: 'LayoutHeader'
    })

    withDefaults(
        defineProps<{
            theme?: string
        }>(),
        {
            theme: 'light'
        }
    )

    const emit = defineEmits<{ clearPreferencesAndLogout: [] }>()

    const accessStore = useAccessStore()
    const { globalSearchShortcutKey, preferencesButtonPosition } = usePreferences()
    const REFERENCE_VALUE = 50

    const slots = useSlots()
    const { refresh } = useRefresh()

    const leftSlots = computed(() => {
        const list: Array<{ index: number; name: string }> = []

        if (preferences.widget.refresh) {
            list.push({
                index: 0,
                name: 'refresh'
            })
        }

        Object.keys(slots).forEach((key) => {
            const name = key.split('-')
            if (key.startsWith('header-left')) {
                list.push({ index: Number(name[2]), name: key })
            }
        })

        return list.sort((a, b) => a.index - b.index)
    })

    const rightSlots = computed(() => {
        const list = [{ index: REFERENCE_VALUE + 100, name: 'user-dropdown' }]

        if (preferences.widget.globalSearch) {
            list.push({
                index: REFERENCE_VALUE,
                name: 'global-search'
            })
        }

        if (preferencesButtonPosition.value.header) {
            list.push({
                index: REFERENCE_VALUE + 10,
                name: 'preferences'
            })
        }

        if (preferences.widget.themeToggle) {
            list.push({
                index: REFERENCE_VALUE + 20,
                name: 'theme-toggle'
            })
        }

        if (preferences.widget.languageToggle) {
            list.push({
                index: REFERENCE_VALUE + 30,
                name: 'language-toggle'
            })
        }

        if (preferences.widget.fullscreen) {
            list.push({
                index: REFERENCE_VALUE + 40,
                name: 'fullscreen'
            })
        }

        if (preferences.widget.notification) {
            list.push({
                index: REFERENCE_VALUE + 50,
                name: 'notification'
            })
        }

        Object.keys(slots).forEach((key) => {
            const name = key.split('-')
            if (key.startsWith('header-right')) {
                list.push({ index: Number(name[2]), name: key })
            }
        })

        return list.sort((a, b) => a.index - b.index)
    })

    /** 清除全局配置并退出登录 */
    function handleClearPreferencesAndLogout() {
        emit('clearPreferencesAndLogout')
    }
</script>

<template>
    <template
        v-for="slot in leftSlots.filter((item) => item.index < REFERENCE_VALUE)"
        :key="slot.name"
    >
        <slot :name="slot.name">
            <template v-if="slot.name === 'refresh'">
                <DagIconButton class="my-0 mr-1 rounded-md" @click="refresh">
                    <RotateCw class="size-4" />
                </DagIconButton>
            </template>
        </slot>
    </template>
    <!-- 顶栏路由 -->
    <div class="flex-center hidden lg:block">
        <slot name="breadcrumb"></slot>
    </div>
    <template
        v-for="slot in leftSlots.filter((item) => item.index > REFERENCE_VALUE)"
        :key="slot.name"
    >
        <slot :name="slot.name"></slot>
    </template>
    <!-- 顶部菜单 -->
    <div
        :class="`menu-align-${preferences.header.menuAlign}`"
        class="flex h-full min-w-0 flex-1 items-center"
    >
        <slot name="menu"></slot>
    </div>

    <div class="flex h-full min-w-0 flex-shrink-0 items-center">
        <template v-for="slot in rightSlots" :key="slot.name">
            <slot :name="slot.name">
                <template v-if="slot.name === 'global-search'">
                    <GlobalSearch
                        :enable-shortcut-key="globalSearchShortcutKey"
                        :menus="accessStore.accessMenus"
                        class="mr-1 sm:mr-4"
                    />
                </template>
                <template v-else-if="slot.name === 'preferences'">
                    <PreferencesButton
                        class="mr-1"
                        @clear-preferences-and-logout="handleClearPreferencesAndLogout"
                    />
                </template>
                <template v-else-if="slot.name === 'theme-toggle'">
                    <ThemeToggle class="mr-1 mt-[2px]" />
                </template>
                <template v-else-if="slot.name === 'language-toggle'">
                    <LanguageToggle class="mr-1" />
                </template>
                <template v-else-if="slot.name === 'fullscreen'">
                    <DagFullScreen class="mr-1" />
                </template>
            </slot>
        </template>
    </div>
</template>

<style lang="scss" scoped>
    .menu-align-start {
        --menu-align: start;
    }

    .menu-align-center {
        --menu-align: center;
    }

    .menu-align-end {
        --menu-align: end;
    }
</style>
