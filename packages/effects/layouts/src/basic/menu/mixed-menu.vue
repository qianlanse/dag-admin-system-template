<script setup lang="ts">
    import type { MenuRecordRaw } from '@dag/types'

    import type { NormalMenuProps } from '@dag-core/menu-ui'

    import { onBeforeMount } from 'vue'
    import { useRoute } from 'vue-router'

    import { findMenuByPath } from '@dag/utils'

    import { NormalMenu } from '@dag-core/menu-ui'

    interface Props extends NormalMenuProps {}

    const props = defineProps<Props>()

    const emit = defineEmits<{
        defaultSelect: [MenuRecordRaw, MenuRecordRaw?]
        enter: [MenuRecordRaw]
        select: [MenuRecordRaw]
    }>()

    const route = useRoute()

    onBeforeMount(() => {
        const menu = findMenuByPath(props.menus || [], route.path)
        if (menu) {
            const rootMenu = (props.menus || []).find((item) => item.path === menu.parents?.[0])
            emit('defaultSelect', menu, rootMenu)
        }
    })

    function handelEnter(menu: MenuRecordRaw) {
        emit('enter', menu)
    }

    function handelSelect(menu: MenuRecordRaw) {
        emit('select', menu)
    }
</script>

<template>
    <NormalMenu
        :active-path="activePath"
        :collapse="collapse"
        :menus="menus"
        :rounded="rounded"
        :theme="theme"
        @enter="handelEnter"
        @select="handelSelect"
    />
</template>
