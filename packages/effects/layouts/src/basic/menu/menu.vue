<script setup lang="ts">
    import type { MenuRecordRaw } from '@dag/types'

    import type { MenuProps } from '@dag-core/menu-ui'

    import { Menu } from '@dag-core/menu-ui'

    interface Props extends MenuProps {
        menus: MenuRecordRaw[]
    }

    const props = withDefaults(defineProps<Props>(), {
        accordion: true,
        menus: () => []
    })

    const emit = defineEmits<{
        open: [string, string[]]
        select: [string, string?]
    }>()

    /** 打开菜单 */
    function handleMenuOpen(key: string, path: string[]) {
        emit('open', key, path)
    }

    /** 选择菜单项 */
    function handleMenuSelect(key: string) {
        emit('select', key, props.mode)
    }
</script>

<template>
    <Menu
        :accordion="accordion"
        :collapse="collapse"
        :collapse-show-title="collapseShowTitle"
        :default-active="defaultActive"
        :menus="menus"
        :mode="mode"
        :rounded="rounded"
        scroll-to-active
        :theme="theme"
        @open="handleMenuOpen"
        @select="handleMenuSelect"
    />
</template>
