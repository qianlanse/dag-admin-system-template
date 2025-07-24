<script setup lang="ts">
    import type { DagDropdownMenuItem, DropdownMenuProps } from './types'

    import {
        DropdownMenu,
        DropdownMenuContent,
        DropdownMenuGroup,
        DropdownMenuItem,
        DropdownMenuSeparator,
        DropdownMenuTrigger
    } from '../../ui'

    interface Props extends DropdownMenuProps {}

    defineOptions({ name: 'DropdownMenu' })

    const props = withDefaults(defineProps<Props>(), {})

    /** 点击菜单 */
    function handleItemClick(menu: DagDropdownMenuItem) {
        if (menu.disabled) {
            return
        }
        menu?.handler?.(props)
    }
</script>

<template>
    <DropdownMenu>
        <DropdownMenuTrigger>
            <slot></slot>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
            <DropdownMenuGroup>
                <template v-for="menu in menus" :key="menu.value">
                    <DropdownMenuItem
                        :disabled="menu.disabled"
                        class="data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground text-foreground/80 mb-1 cursor-pointer"
                        @click="handleItemClick(menu)"
                    >
                        <component :is="menu.icon" v-if="menu.icon" class="mr-2 size-4" />
                        {{ menu.label }}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator v-if="menu.separator" class="bg-border" />
                </template>
            </DropdownMenuGroup>
        </DropdownMenuContent>
    </DropdownMenu>
</template>
