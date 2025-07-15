<script setup lang="ts">
    import type { UseResizeObserverReturn } from '@vueuse/core'

    import type { VNodeArrayChildren } from 'vue'

    import type { MenuItemClicked, MenuItemRegistered, MenuProps, MenuProvider } from '../types'

    import { computed, reactive, ref, toRef, useSlots, watch, watchEffect } from 'vue'

    import { useNamespace } from '@dag-core/composables'
    import { Ellipsis } from '@dag-core/icons'

    import { useResizeObserver } from '@vueuse/core'

    import { useMenuStyle } from '../hooks'
    import { useMenuScroll } from '../hooks/use-men-scroll'
    import { createMenuContext, createSubMenuContext } from '../hooks/use-menu-context'
    import { flattedChildren } from '../utils'
    import SubMenu from './sub-menu.vue'

    interface Props extends MenuProps {}

    defineOptions({
        name: 'Menu'
    })

    const props = withDefaults(defineProps<Props>(), {
        accordion: true,
        collapse: false,
        mode: 'vertical',
        rounded: true,
        scrollToActive: false,
        theme: 'dark'
    })

    const emit = defineEmits<{
        close: [string, string[]]
        open: [string, string[]]
        select: [string, string[]]
    }>()

    /** refs */
    const sliceIndex = ref(-1)
    const menuRef = ref<HTMLUListElement>()
    const mouseInChild = ref(false)
    const activePath = ref<MenuProvider['activePath']>(props.defaultActive)
    const openedMenus = ref<MenuProvider['openedMenus']>(
        props.defaultOpeneds && !props.collapse ? [...props.defaultOpeneds] : []
    )
    const subMenus = ref<MenuProvider['subMenus']>({})
    const items = ref<MenuProvider['items']>({})

    /** hooks */
    const { b, is } = useNamespace('menu')
    const menuStyle = useMenuStyle()
    const slots = useSlots()

    /** computeds */
    const getSlot = computed(() => {
        // 更新插槽内容
        const defaultSlots: VNodeArrayChildren = slots.default?.() ?? []

        const originalSlot = flattedChildren(defaultSlots) as VNodeArrayChildren
        const slotDefault =
            sliceIndex.value === -1 ? originalSlot : originalSlot.slice(0, sliceIndex.value)

        const slotMore = sliceIndex.value === -1 ? [] : originalSlot.slice(sliceIndex.value)

        return { showSlotMore: slotMore.length > 0, slotDefault, slotMore }
    })
    const isMenuPopup = computed<MenuProvider['isMenuPopup']>(
        () => props.mode === 'horizontal' || (props.mode === 'vertical' && props.collapse)
    )
    const enableScroll = computed(
        () => props.scrollToActive && props.mode === 'vertical' && !props.collapse
    )

    const { scrollToActiveItem } = useMenuScroll(activePath, {
        delay: 320,
        enable: enableScroll
    })

    /** watches */
    /** 滚动到指定位置 */
    watch(activePath, () => {
        scrollToActiveItem()
    })

    watch(
        () => props.defaultActive,
        (currentActive = '') => {
            if (!items.value[currentActive]) {
                activePath.value = ''
            }
            updateActiveName(currentActive)
        }
    )

    /** 折叠后清空所有打开的菜单 */
    watch(
        () => props.collapse,
        (value) => {
            if (value) openedMenus.value = []
        }
    )

    watch(items.value, initMenu)

    // 菜单注入上下文
    createMenuContext(
        reactive({
            activePath,
            addMenuItem,
            addSubMenu,
            closeMenu,
            handleMenuItemClick,
            handleSubMenuClick,
            isMenuPopup,
            openedMenus,
            openMenu,
            props,
            removeMenuItem,
            removeSubMenu,
            subMenus,
            theme: toRef(props, 'theme'),
            items
        })
    )

    // 子菜单注入上下文
    createSubMenuContext({
        addSubMenu,
        level: 1,
        mouseInChild,
        removeSubMenu
    })

    let resizeStopper: UseResizeObserverReturn['stop']
    watchEffect(() => {
        if (props.mode === 'horizontal') {
            resizeStopper = useResizeObserver(menuRef, handleResize).stop
        } else {
            resizeStopper?.()
        }
    })

    /** functions */

    function handleResize() {
        // if (sliceIndex.value === calc)
    }

    /** 展开默认菜单 */
    function initMenu() {
        const parentPaths = getActivePaths()

        // 展开该菜单项的路径上所有子菜单
        parentPaths.forEach((path) => {
            const subMenu = subMenus.value[path]
            subMenu && openMenu(path, subMenu.parentPaths)
        })
    }

    /** 获取激活菜单 */
    function getActivePaths() {
        const activeItem = activePath.value && items.value[activePath.value]

        if (!activeItem || props.mode === 'horizontal' || props.collapse) {
            return []
        }

        return activeItem.parentPaths
    }

    /** 关闭 */
    function close(path: string) {
        const i = openedMenus.value.indexOf(path)

        if (i !== -1) {
            openedMenus.value.splice(i, 1)
        }
    }

    /** 新增菜单 */
    function addMenuItem(item: MenuItemRegistered) {
        items.value[item.path] = item
    }

    /** 新增子菜单 */
    function addSubMenu(subMenu: MenuItemRegistered) {
        subMenus.value[subMenu.path] = subMenu
    }

    /** 打开子菜单 */
    function openMenu(path: string, parentPaths: string[]) {
        if (openedMenus.value.includes(path)) {
            return
        }

        if (props.accordion) {
            const activeParentPaths = getActivePaths()
            if (activeParentPaths.includes(path)) {
                parentPaths = activeParentPaths
            }
            openedMenus.value = openedMenus.value.filter((path: string) =>
                parentPaths.includes(path)
            )
        }

        openedMenus.value.push(path)
        emit('open', path, parentPaths)
    }

    /** 关闭子菜单 */
    function closeMenu(path: string, parentPaths: string[]) {
        if (props.accordion) {
            openedMenus.value = subMenus.value[path]?.parentPaths ?? []
        }

        close(path)

        emit('close', path, parentPaths)
    }

    /** 子菜单点击导航或其它功能 */
    function handleMenuItemClick(data: MenuItemClicked) {
        const { collapse, mode } = props
        if (mode === 'horizontal' || collapse) {
            openedMenus.value = []
        }
        const { parentPaths, path } = data
        if (!path || !parentPaths) {
            return
        }

        emit('select', path, parentPaths)
    }

    /** 打开/关闭子菜单 */
    function handleSubMenuClick({ parentPaths, path }: MenuItemRegistered) {
        const isOpened = openedMenus.value.includes(path)

        if (isOpened) {
            closeMenu(path, parentPaths)
        } else {
            openMenu(path, parentPaths)
        }
    }

    /** 删除菜单 */
    function removeMenuItem(item: MenuItemRegistered) {
        Reflect.deleteProperty(items.value, item.path)
    }

    /** 删除子菜单 */
    function removeSubMenu(item: MenuItemRegistered) {
        Reflect.deleteProperty(subMenus.value, item.path)
    }

    /** 更新选择菜单 */
    function updateActiveName(val: string) {
        const itemsInData = items.value
        const item =
            itemsInData[val] ||
            (activePath.value && itemsInData[activePath.value]) ||
            itemsInData[props.defaultActive || '']

        activePath.value = item ? item.path : val
    }
</script>

<template>
    <ul
        ref="menuRef"
        :class="[
            theme,
            b(),
            is(mode, true),
            is(theme, true),
            is('rounded', rounded),
            is('collapse', collapse),
            is('menu-align', mode === 'horizontal')
        ]"
        :style="menuStyle"
        role="menu"
    >
        <template v-if="mode === 'horizontal' && getSlot.showSlotMore">
            <template v-for="item in getSlot.slotDefault" :key="item.key">
                <component :is="item" />
            </template>
            <SubMenu is-sub-menu-more path="sub-menu-more">
                <template #title>
                    <Ellipsis class="size-4" />
                </template>
                <template v-for="item in getSlot.slotMore" :key="item.key">
                    <component :is="item" />
                </template>
            </SubMenu>
        </template>
        <template v-else>
            <slot></slot>
        </template>
    </ul>
</template>

<style lang="scss">
    $namespace: dag;

    /** mixins */

    @mixin menu-item {
        position: relative;
        display: flex;
        align-items: center;
        height: var(--menu-item-height);
        padding: var(--menu-item-padding-y) var(--menu-item-padding-x);
        margin: 0 var(--menu-item-margin-x) var(--menu-item-margin-y) var(--menu-item-margin-x);
        font-size: var(--menu-font-size);
        color: var(--menu-item-color);
        text-decoration: none;
        white-space: nowrap;
        list-style: none;
        cursor: pointer;
        background: var(--menu-item-background-color);
        border: none;
        border-radius: var(--menu-item-radius);
        transition:
            background 0.15s ease,
            color 0.15s ease,
            padding 0.15s ease,
            border-color 0.15s ease;

        &.is-disabled {
            cursor: not-allowed;
            background: none !important;
            opacity: 0.25;
        }

        .#{$namespace}-menu__icon {
            transition: transform 0.25s;
        }

        &:hover {
            .#{$namespace}-menu__icon {
                transform: scale(1.2);
            }
        }

        &:hover,
        &:focus {
            outline: none;
        }

        * {
            vertical-align: bottom;
        }
    }

    @mixin menu-title {
        max-width: var(--menu-title-width);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        opacity: 1;
    }

    @mixin menu-item-active {
        color: var(--menu-item-active-color);
        text-decoration: none;
        cursor: pointer;
        background: var(--menu-item-active-background-color);
    }

    /** variables */

    .#{$namespace}-menu__popup-container,
    .#{$namespace}-menu {
        --menu-title-width: 140px;
        --menu-item-icon-size: 16px;
        --menu-item-height: 38px;
        --menu-item-padding-y: 21px;
        --menu-item-padding-x: 12px;
        --menu-item-margin-y: 2px;
        --menu-item-margin-x: 0px;
        --menu-item-popup-padding-y: 20px;
        --menu-item-popup-padding-x: 12px;
        --menu-item-collapse-padding-y: 23.5px;
        --menu-item-collapse-padding-x: 0px;
        --menu-item-collapse-margin-y: 4px;
        --menu-item-collapse-margin-x: 0px;
        --menu-item-radius: 0px;
        --menu-item-indent: 16px;
        --menu-font-size: 14px;

        &.is-dark {
            --menu-background-color: hsl(var(--menu));
            --menu-item-background-color: var(--menu-background-color);
            --menu-item-color: hsl(var(--foreground) / 80%);
            --menu-submenu-background-color: var(--menu-background-color);
            --menu-item-active-background-color: hsl(var(--accent));
            --menu-item-active-color: hsl(var(--accent-foreground));
            --menu-submenu-hover-color: hsl(var(--foreground));
            --menu-submenu-hover-background-color: hsl(var(--accent));
            --menu-submenu-active-color: hsl(var(--foreground));
            --menu-submenu-active-background-color: transparent;
            --menu-item-hover-color: hsl(var(--accent-foreground));
            --menu-item-hover-background-color: hsl(var(--accent));
        }

        &.is-light {
            --menu-background-color: hsl(var(--menu));
            --menu-item-background-color: var(--menu-background-color);
            --menu-item-color: hsl(var(--foreground));
            --menu-submenu-background-color: var(--menu-background-color);
            --menu-item-active-background-color: hsl(var(--primary) / 15%);
            --menu-item-active-color: hsl(var(--primary));
            --menu-submenu-hover-color: hsl(var(--primary));
            --menu-submenu-hover-background-color: hsl(var(--accent));
            --menu-submenu-active-color: hsl(var(--primary));
            --menu-submenu-active-background-color: transparent;
            --menu-item-hover-color: var(--menu-item-color);
            --menu-item-hover-background-color: hsl(var(--accent));
        }

        &.is-rounded {
            --menu-item-margin-x: 8px;
            --menu-item-collapse-margin-x: 6px;
            --menu-item-radius: 8px;
        }
    }

    /** contents */

    .#{$namespace}-menu {
        position: relative;
        box-sizing: border-box;
        padding-left: 0;
        margin: 0;
        list-style: none;
        background: hsl(var(--menu-background-color));

        // 垂直菜单
        &.is-vertical {
            &:not(.#{$namespace}-menu.is-collapse) {
                & .#{$namespace}-menu-item,
                & .#{$namespace}-sub-menu-content,
                & .#{$namespace}-menu-item-group__title {
                    padding-left: calc(
                        var(--menu-item-indent) + var(--menu-level) * var(--menu-item-indent)
                    );
                    white-space: nowrap;
                }

                & > .#{$namespace}-sub-menu {
                    & > .#{$namespace}-menu {
                        & > .#{$namespace}-menu-item {
                            padding-left: calc(
                                0px + var(--menu-item-indent) + var(--menu-level) *
                                    var(--menu-item-indent)
                            );
                        }
                    }

                    & > .#{$namespace}-sub-menu-content {
                        padding-left: calc(var(--menu-item-indent) - 8px);
                    }
                }

                & > .#{$namespace}-menu-item {
                    padding-left: calc(var(--menu-item-indent) - 8px);
                }
            }
        }

        // 折叠菜单
        &.is-collapse {
            .#{$namespace}-menu__icon {
                margin-right: 0;
            }

            .#{$namespace}-sub-menu__icon-arrow {
                display: none;
            }

            .#{$namespace}-menu-item,
            .#{$namespace}-sub-menu-content {
                display: flex;
                align-items: center;
                justify-content: center;
                padding: var(--menu-item-collapse-padding-y) var(--menu-item-collapse-padding-x);
                margin: var(--menu-item-collapse-margin-y) var(--menu-item-collapse-margin-x);
                transition: all 0.3s;

                &.is-active {
                    background: var(--menu-item-active-background-color) !important;
                    border-radius: var(--menu-item-radius);
                }
            }

            &.is-light {
                .#{$namespace}-menu-item,
                .#{$namespace}-sub-menu-content {
                    &.is-active {
                        background: var(--menu-item-active-background-color) !important;
                    }
                }
            }

            &.is-rounded {
                .#{$namespace}-menu-item,
                .#{$namespace}-sub-menu-content {
                    &.is-collapse-show-title {
                        margin: 4px 8px !important;
                    }
                }
            }
        }

        &__icon {
            flex-shrink: 0;
            width: var(--menu-item-icon-size);
            height: var(--menu-item-icon-size);
            margin-right: 8px;
            text-align: center;
            vertical-align: middle;
        }

        &__popup-container {
            max-width: 240px;
            height: unset;
            padding: 0;
            background: var(--menu-background-color);
        }

        &__popup {
            padding: 10px 0;
            border-radius: var(--menu-item-radius);

            .#{$namespace}-menu-item,
            .#{$namespace}-sub-menu-content {
                padding: var(--menu-item-popup-padding-y) var(--menu-item-popup-padding-x);
            }
        }
    }

    .#{$namespace}-menu-item {
        fill: var(--menu-item-color);

        @include menu-item;

        &.is-active {
            fill: var(--menu-item-active-color);

            @include menu-item-active;
        }

        &__content {
            display: inline-flex;
            align-items: center;
            width: 100%;
            height: var(--menu-item-height);

            span {
                @include menu-title;
            }
        }

        &.is-collapse-show-title {
            padding: 32px 0 !important;

            .#{$namespace}-menu-tooltip__trigger {
                flex-direction: column;
            }

            .#{$namespace}-menu__icon {
                display: block;
                font-size: 20px !important;
                transition: all 0.25s ease;
            }

            .#{$namespace}-menu__name {
                display: inline-flex;
                margin-top: 8px;
                margin-bottom: 0;
                font-size: 12px;
                font-weight: 400;
                line-height: normal;
                transition: all 0.25s ease;
            }
        }

        &:not(.is-active):hover {
            color: var(--menu-item-hover-color);
            text-decoration: none;
            cursor: pointer;
            background: var(--menu-item-hover-background-color) !important;
        }

        .#{$namespace}-menu-tooltip__trigger {
            position: absolute;
            top: 0;
            left: 0;
            box-sizing: border-box;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 100%;
            padding: 0 var(--menu-item-padding-x);
            font-size: var(--menu-font-size);
            line-height: var(--menu-item-height);
        }
    }

    .#{$namespace}-sub-menu {
        padding-left: 0;
        margin: 0;
        list-style: none;
        background: var(--menu-submenu-background-color);
        fill: var(--menu-item-color);

        &.is-active {
            div[data-state='open'] > .#{$namespace}-sub-menu-content,
            > .#{$namespace}-sub-menu-content {
                color: var(--menu-submenu-active-color);
                text-decoration: none;
                cursor: pointer;
                background: var(--menu-submenu-active-background-color);
                fill: var(--menu-submenu-active-color);
            }
        }
    }

    .#{$namespace}-sub-menu-content {
        height: var(--menu-item-height);

        @include menu-item;

        &__icon-arrow {
            position: absolute;
            top: 50%;
            right: 10px;
            width: inherit;
            margin-top: -8px;
            margin-right: 0;
            font-weight: normal;
            opacity: 1;
            transition: transform 0.25s ease;
        }

        &__title {
            @include menu-title;
        }

        &.is-collapse-show-title {
            flex-direction: column;
            padding: 32px 0 !important;

            .#{$namespace}-menu__icon {
                display: block;
                font-size: 20px !important;
                transition: all 0.25s ease;
            }

            .#{$namespace}-sub-menu-content__title {
                display: inline-flex;
                flex-shrink: 0;
                margin-top: 8px;
                margin-bottom: 0;
                font-size: 12px;
                font-weight: 400;
                line-height: normal;
                transition: all 0.25s ease;
            }
        }

        &.is-more {
            padding-left: 12px !important;
        }

        &:hover {
            color: var(--menu-submenu-hover-color);
            text-decoration: none;
            cursor: pointer;
            background: var(--menu-submenu-hover-background-color) !important;
        }
    }
</style>
