<script lang="ts" setup>
    import type { HoverCardContentProps } from '@dag-core/shadcn-ui'

    import type { MenuItemRegistered, MenuProvider, SubMenuProps } from '../types'

    import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'

    import { useNamespace } from '@dag-core/composables'
    import { DagHoverCard } from '@dag-core/shadcn-ui'

    import {
        createSubMenuContext,
        useMenu,
        useMenuContext,
        useMenuStyle,
        useSubMenuContext
    } from '../hooks'
    import CollapseTransition from './collapse-transition.vue'
    import SubMenuContent from './sub-menu-content.vue'

    interface Props extends SubMenuProps {
        isSubMenuMore?: boolean
    }

    defineOptions({ name: 'SubMenu' })

    const props = withDefaults(defineProps<Props>(), {
        disabled: false,
        isSubMenuMore: false
    })

    /** hooks */
    const { parentMenu, parentPaths } = useMenu()
    const { b, is } = useNamespace('sub-menu')
    const nsMenu = useNamespace('menu')
    const rootMenu = useMenuContext()
    const subMenu = useSubMenuContext()
    const subMenuStyle = useMenuStyle(subMenu)

    /** refs */
    const mouseInChild = ref(false)
    const items = ref<MenuProvider['items']>({})
    const subMenus = ref<MenuProvider['subMenus']>({})
    const timer = ref<null | ReturnType<typeof setTimeout>>(null)

    /** computeds */
    const opened = computed(() => {
        return rootMenu?.openedMenus.includes(props.path)
    })
    const isTopLevelMenuSubmenu = computed(() => parentMenu.value?.type.name === 'Menu')
    const mode = computed(() => rootMenu?.props.mode ?? 'vertical')
    const rounded = computed(() => rootMenu?.props.rounded)
    const currentLevel = computed(() => subMenu?.level ?? 0)
    const isFirstLevel = computed(() => {
        return currentLevel.value === 1
    })
    const contentProps = computed((): HoverCardContentProps => {
        const isHorizontal = mode.value === 'horizontal'
        const side = isHorizontal && isFirstLevel.value ? 'bottom' : 'right'
        return {
            collisionPadding: { top: 20 },
            side,
            sideOffset: isHorizontal ? 5 : 10
        }
    })
    const active = computed(() => {
        let isActive = false

        Object.values(items.value).forEach((item) => {
            if (item.active) {
                isActive = true
            }
        })

        Object.values(subMenus.value).forEach((subItem) => {
            if (subItem.active) {
                isActive = true
            }
        })
        return isActive
    })
    const menuIcon = computed(() => (active.value ? props.activeIcon || props.icon : props.icon))

    /** functions */

    /** 添加子菜单 */
    function addSubMenu(subMenu: MenuItemRegistered) {
        subMenus.value[subMenu.path] = subMenu
    }

    /** 移除子菜单 */
    function removeSubMenu(subMenu: MenuItemRegistered) {
        Reflect.deleteProperty(subMenus.value, subMenu.path)
    }

    /** 菜单点击后跳转 */
    function handleClick() {
        const mode = rootMenu?.props.mode
        if (
            props.disabled ||
            (rootMenu?.props.collapse && mode === 'vertical') ||
            mode === 'horizontal'
        ) {
            return
        }

        rootMenu?.handleSubMenuClick({
            active: active.value,
            parentPaths: parentPaths.value,
            path: props.path
        })
    }

    function handleMouseenter(event: FocusEvent | MouseEvent, showTimeout = 300) {
        if (event.type === 'focus') {
            return
        }

        if ((!rootMenu?.props.collapse && rootMenu?.props.mode === 'vertical') || props.disabled) {
            if (subMenu) {
                subMenu.mouseInChild.value = true
            }
            return
        }
        if (subMenu) {
            subMenu.mouseInChild.value = true
        }

        timer.value && window.clearTimeout(timer.value)
        timer.value = setTimeout(() => {
            rootMenu?.openMenu(props.path, parentPaths.value)
        }, showTimeout)
        parentMenu.value?.vnode.el?.dispatchEvent(new MouseEvent('mouseenter'))
    }

    function handleMouseleave(deepDispatch = false) {
        if (!rootMenu?.props.collapse && rootMenu?.props.mode === 'vertical' && subMenu) {
            subMenu.mouseInChild.value = false
            return
        }

        timer.value && window.clearTimeout(timer.value)

        if (subMenu) {
            subMenu.mouseInChild.value = false
        }
        timer.value = setTimeout(() => {
            !mouseInChild.value && rootMenu?.closeMenu(props.path, parentPaths.value)
        }, 300)

        if (deepDispatch) {
            subMenu?.handleMouseleave?.(true)
        }
    }

    const item = reactive({
        active,
        parentPaths,
        path: props.path
    })

    onMounted(() => {
        subMenu?.addSubMenu?.(item)
        rootMenu?.addSubMenu?.(item)
    })

    onBeforeUnmount(() => {
        subMenu?.removeSubMenu?.(item)
        rootMenu?.removeSubMenu?.(item)
    })

    createSubMenuContext({
        addSubMenu,
        handleMouseleave,
        level: (subMenu?.level ?? 0) + 1,
        mouseInChild,
        removeSubMenu
    })
</script>
<template>
    <li
        :class="[b(), is('opened', opened), is('active', active), is('disabled', disabled)]"
        @focus="handleMouseenter"
        @mouseenter="handleMouseenter"
        @mouseleave="() => handleMouseleave()"
    >
        <!-- 折叠后显示菜单内容 -->
        <template v-if="rootMenu.isMenuPopup">
            <DagHoverCard
                :content-class="[
                    rootMenu.theme,
                    nsMenu.e('popup-container'),
                    is(rootMenu.theme, true),
                    opened ? '' : 'hidden',
                    'overflow-auto',
                    'max-h-[calc(var(--radix-hover-card-content-available-height)-20px)]'
                ]"
                :content-props="contentProps"
                :open="true"
                :open-delay="0"
            >
                <template #trigger>
                    <SubMenuContent
                        :class="is('active', active)"
                        :icon="menuIcon"
                        :is-menu-more="isSubMenuMore"
                        :is-top-level-menu-submenu="isTopLevelMenuSubmenu"
                        :level="currentLevel"
                        :path="path"
                        @click.stop="handleClick"
                    >
                        <template #title>
                            <slot name="title"></slot>
                        </template>
                    </SubMenuContent>
                </template>
                <div
                    :class="[nsMenu.is(mode, true), nsMenu.e('popup')]"
                    @focus="(e) => handleMouseenter(e, 100)"
                    @mouseenter="(e) => handleMouseenter(e, 100)"
                    @mouseleave="() => handleMouseleave(true)"
                >
                    <ul :class="[nsMenu.b(), is('rounded', rounded)]" :style="subMenuStyle">
                        <slot></slot>
                    </ul>
                </div>
            </DagHoverCard>
        </template>
        <!-- 正常显示菜单内容 -->
        <template v-else>
            <SubMenuContent
                :class="is('active', active)"
                :icon="menuIcon"
                :is-menu-more="isSubMenuMore"
                :is-top-level-menu-submenu="isTopLevelMenuSubmenu"
                :level="currentLevel"
                :path="path"
                @click.stop="handleClick"
            >
                <slot name="content"></slot>
                <template #title>
                    <slot name="title"></slot>
                </template>
            </SubMenuContent>
            <CollapseTransition>
                <ul
                    v-show="opened"
                    :class="[nsMenu.b(), is('rounded', rounded)]"
                    :style="subMenuStyle"
                >
                    <slot></slot>
                </ul>
            </CollapseTransition>
        </template>
    </li>
</template>
