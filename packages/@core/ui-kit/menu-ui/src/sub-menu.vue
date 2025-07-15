<script setup lang="ts">
    import type { MenuRecordRaw } from '@dag-core/typings'

    import { computed } from 'vue'

    import { MenuBadge, MenuItem, SubMenu as SubMenuComp } from './components'
    // eslint-disable-next-line import/no-self-import
    import SubMenu from './sub-menu.vue'

    interface Props {
        menu: MenuRecordRaw
    }

    defineOptions({
        name: 'SubMenuUi'
    })

    const props = withDefaults(defineProps<Props>(), {})

    const hasChildren = computed(() => {
        const { menu } = props

        return Reflect.has(menu, 'children') && !!menu.children && menu.children.length > 0
    })
</script>

<template>
    <SubMenuComp
        v-if="hasChildren"
        :key="`${menu.path}_sub`"
        :active-icon="menu.activeIcon"
        :icon="menu.icon"
        :path="menu.path"
    >
        <template #content>
            <MenuBadge
                :badge="menu.badge"
                :badge-type="menu.badgeType"
                :badge-variants="menu.badgeVariants"
                class="right-6"
            />
        </template>
        <template #title>
            <span>{{ menu.name }}</span>
        </template>
        <!-- 渲染本身 -->
        <template v-for="childItem in menu.children || []" :key="childItem.path">
            <SubMenu :menu="childItem" />
        </template>
    </SubMenuComp>
    <MenuItem
        v-else
        :key="menu.path"
        :active-icon="menu.activeIcon"
        :badge="menu.badge"
        :badge-type="menu.badgeType"
        :badge-variants="menu.badgeVariants"
        :icon="menu.icon"
        :path="menu.path"
    >
        <template #title>
            <span>{{ menu.name }}</span>
        </template>
    </MenuItem>
</template>
