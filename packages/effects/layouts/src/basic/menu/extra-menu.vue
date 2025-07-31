<script setup lang="ts">
    import type { MenuRecordRaw } from '@dag/types'

    import type { MenuProps } from '@dag-core/menu-ui'

    import { useRoute } from 'vue-router'

    import { Menu } from '@dag-core/menu-ui'

    import { useNavigation } from './use-navigation'

    interface Props extends MenuProps {
        collapse?: boolean
        menus?: MenuRecordRaw[]
    }

    withDefaults(defineProps<Props>(), {
        accordion: true,
        menus: () => []
    })

    const route = useRoute()
    const { navigation } = useNavigation()

    /** 选择菜单 */
    function handleSelect(path: string) {
        navigation(path)
    }
</script>

<template>
    <Menu
        :accordion="accordion"
        :collapse="collapse"
        :default-active="route.meta?.activePath || route.path"
        :menus="menus"
        :rounded="rounded"
        :theme="theme"
        mode="vertical"
        @select="handleSelect"
    />
</template>
