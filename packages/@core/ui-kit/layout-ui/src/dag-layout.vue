<script setup lang="ts">
    import type { CSSProperties } from 'vue'

    import type { DagLayoutProps } from './types'

    import { computed, ref, watch } from 'vue'

    import {
        SCROLL_FIXED_CLASS,
        useLayoutFooterStyle,
        useLayoutHeaderStyle
    } from '@dag-core/composables'
    import { Menu } from '@dag-core/icons'
    import { DagIconButton } from '@dag-core/shadcn-ui'
    import { ELEMENT_ID_MAIN_CONTENT } from '@dag-core/shared/constants'

    import { useMouse, useScroll, useThrottleFn } from '@vueuse/core'

    import {
        LayoutContent,
        LayoutFooter,
        LayoutHeader,
        LayoutSidebar,
        LayoutTabbar
    } from './components'
    import { useLayout } from './hooks/use-layout'

    interface Props extends DagLayoutProps {}

    const props = withDefaults(defineProps<Props>(), {
        contentCompact: 'wide',
        contentCompactWidth: 1200,
        contentPadding: 0,
        contentPaddingBottom: 0,
        contentPaddingLeft: 0,
        contentPaddingRight: 0,
        contentPaddingTop: 0,
        footerEnable: false,
        footerFixed: true,
        footerHeight: 32,
        headerHeight: 50,
        headerHidden: false,
        headerMode: 'fixed',
        headerToggleSidebarButton: true,
        headerVisible: true,
        isMobile: false,
        layout: 'sidebar-nav',
        sidebarCollapsedButton: true,
        sidebarCollapseShowTitle: false,
        sidebarExtraCollapsedWidth: 60,
        sidebarFixedButton: true,
        sidebarHidden: false,
        sidebarMixedWidth: 80,
        sidebarTheme: 'dark',
        sidebarWidth: 180,
        sideCollapseWidth: 60,
        tabbarEnable: true,
        tabbarHeight: 40,
        zIndex: 200
    })

    const emit = defineEmits<{ sideMouseLeave: []; toggleSidebar: [] }>()

    const idMainContent = ELEMENT_ID_MAIN_CONTENT

    /** refs */
    const contentRef = ref<HTMLDivElement>()
    const sidebarExpandOnHovering = ref(false)
    const headerInHidden = ref(false)
    const headerIsHidden = ref(false)

    /** hooks */
    const {
        currentLayout,
        isFullContent,
        isHeaderMixedNav,
        isHeaderNav,
        isMixedNav,
        isSidebarMixedNav
    } = useLayout(props)
    const { directions, isScrolling, y: scrollY } = useScroll(document)
    const { y: mouseY } = useMouse({ target: contentRef, type: 'client' })
    const { setLayoutFooterHeight } = useLayoutFooterStyle()
    const { setLayoutHeaderHeight } = useLayoutHeaderStyle()

    /** models */
    const sidebarExpandOnHover = defineModel<boolean>('sidebarExpandOnHover', {
        default: true
    })
    const sidebarEnable = defineModel<boolean>('sidebarEnable', { default: true })
    const sidebarCollapse = defineModel<boolean>('sidebarCollapse', { default: false })
    const sidebarExtraCollapse = defineModel<boolean>('sidebarExtraCollapse', { default: false })
    const sidebarExtraVisible = defineModel<boolean>('sidebarExtraVisible')

    /** computeds */
    /** 扩展区域宽度 */
    const sidebarExtraWidth = computed(() => {
        const { sidebarExtraCollapsedWidth, sidebarWidth } = props

        return sidebarExtraCollapse.value ? sidebarExtraCollapsedWidth : sidebarWidth
    })

    /** 侧边栏层级 */
    const sidebarZIndex = computed(() => {
        const { isMobile, zIndex } = props
        let offset = isMobile || isSideMode.value ? 1 : -1

        if (isMixedNav.value) {
            offset += 1
        }

        return zIndex + offset
    })

    /** 获取侧栏折叠宽度 */
    const getSideCollapseWidth = computed(() => {
        const { sidebarCollapseShowTitle, sidebarMixedWidth, sideCollapseWidth } = props

        return sidebarCollapseShowTitle || isSidebarMixedNav.value || isHeaderMixedNav.value
            ? sidebarMixedWidth
            : sideCollapseWidth
    })

    /** 是否显示侧栏 */
    const showSidebar = computed(
        () => isSideMode.value && sidebarEnable.value && !props.sidebarHidden
    )

    /** 是否侧边栏模式，包含混合侧边 */
    const isSideMode = computed(() =>
        [
            'header-mixed-nav',
            'header-sidebar-nav',
            'mixed-nav',
            'sidebar-mixed-nav',
            'sidebar-nav'
        ].includes(currentLayout.value)
    )

    /** 动态获取侧边栏区域是否可见 */
    const sidebarEnableState = computed(() => !isHeaderNav.value && sidebarEnable.value)

    /** 动态获取侧边宽度 */
    const getSidebarWidth = computed(() => {
        const { isMobile, sidebarHidden, sidebarMixedWidth, sidebarWidth } = props
        let width = 0

        if (sidebarHidden) {
            return width
        }

        if (
            !sidebarEnableState.value ||
            (sidebarHidden &&
                !isSidebarMixedNav.value &&
                !isMixedNav.value &&
                !isHeaderMixedNav.value)
        ) {
            return width
        }

        if ((isHeaderMixedNav.value || isSidebarMixedNav.value) && !isMobile) {
            width = sidebarMixedWidth
        } else if (sidebarCollapse.value) {
            width = isMobile ? 0 : getSideCollapseWidth.value
        } else {
            width = sidebarWidth
        }

        return width
    })

    /** 侧边区域距离顶部高度 */
    const sidebarMarginTop = computed(() => {
        const { headerHeight, isMobile } = props
        return isMixedNav.value && !isMobile ? headerHeight : 0
    })

    /** 是否显示遮罩 */
    const maskVisible = computed(() => !sidebarCollapse.value && props.isMobile)

    /** 遮罩样式 */
    const maskStyle = computed((): CSSProperties => {
        return { zIndex: props.zIndex }
    })

    /** 主样式 */
    const mainStyle = computed(() => {
        let width = '100%'
        let sidebarAndExtraWidth = 'unset'

        if (
            headerFixed.value &&
            !['header-nav', 'header-sidebar-nav', 'mixed-nav'].includes(currentLayout.value) &&
            showSidebar.value &&
            !props.isMobile
        ) {
            const isSideNavEffective =
                (isSidebarMixedNav.value || isHeaderMixedNav.value) &&
                sidebarExpandOnHover &&
                sidebarExtraVisible.value

            if (isSideNavEffective) {
                const sideCollapseWidth = sidebarCollapse.value
                    ? getSideCollapseWidth.value
                    : props.sidebarMixedWidth
                const sideWidth = sidebarExtraCollapse.value
                    ? props.sidebarExtraCollapsedWidth
                    : props.sidebarWidth

                sidebarAndExtraWidth = `${sideCollapseWidth + sideWidth}px`
                width = `calc(100% - ${sidebarAndExtraWidth})`
            } else {
                sidebarAndExtraWidth =
                    sidebarExpandOnHovering.value && !sidebarExpandOnHover.value
                        ? `${getSideCollapseWidth.value}px`
                        : `${getSidebarWidth.value}px`
                width = `calc(100% - ${sidebarAndExtraWidth})`
            }
        }

        return {
            sidebarAndExtraWidth,
            width
        }
    })

    const headerFixed = computed(() => {
        const { headerMode } = props
        return isMixedNav.value || ['auto', 'auto-scroll', 'fixed'].includes(headerMode)
    })

    /** 顶部高度 */
    const headerWrapperHeight = computed(() => {
        let height = 0
        if (props.headerVisible && !props.headerHidden) {
            height += props.headerHeight
        }
        if (props.tabbarEnable) {
            height += props.tabbarHeight
        }

        return height
    })

    /** 顶部层高 */
    const headerZIndex = computed(() => {
        const { zIndex } = props
        const offset = isMixedNav.value ? 1 : 0
        return zIndex + offset
    })

    /** 顶部样式 */
    const headerWrapperStyle = computed((): CSSProperties => {
        const fixed = headerFixed.value
        return {
            height: isFullContent.value ? '0' : `${headerWrapperHeight.value}px`,
            left: isMixedNav.value ? 0 : mainStyle.value.sidebarAndExtraWidth,
            position: fixed ? 'fixed' : 'static',
            top:
                headerInHidden.value || isFullContent.value ? `-${headerWrapperHeight.value}px` : 0,
            width: mainStyle.value.width,
            'z-index': headerZIndex.value
        }
    })

    /** Header是否显示Logo */
    const showHeaderLogo = computed(() => !isSideMode.value || isMixedNav.value || props.isMobile)

    /** 是否显示切换侧栏显示按钮 */
    const showHeaderToggleButton = computed(
        () =>
            props.isMobile ||
            (props.headerToggleSidebarButton &&
                isSideMode.value &&
                !isSidebarMixedNav.value &&
                !isMixedNav.value &&
                !props.isMobile)
    )

    /** 导航栏样式 */
    const tabbarStyle = computed((): CSSProperties => {
        let width = ''
        let marginLeft = 0

        if (!isMixedNav.value || props.sidebarHidden) {
            width = '100%'
        } else if (sidebarEnable.value) {
            const onHoveringWidth = sidebarExpandOnHover.value
                ? props.sidebarWidth
                : getSideCollapseWidth.value

            marginLeft = sidebarCollapse.value ? getSideCollapseWidth.value : onHoveringWidth
            width = `calc(100% - ${sidebarCollapse.value ? getSidebarWidth.value : onHoveringWidth}px)`
        } else {
            width = '100%'
        }

        return {
            marginLeft,
            width
        }
    })

    /** header模式 */
    const isHeaderAutoMode = computed(() => props.headerMode === 'auto')

    /** 主内容样式 */
    const contentStyle = computed((): CSSProperties => {
        const fixed = headerFixed.value
        const { footerEnable, footerFixed, footerHeight } = props

        return {
            marginTop:
                fixed &&
                !isFullContent.value &&
                !headerIsHidden.value &&
                (!isHeaderAutoMode.value || scrollY.value < headerWrapperHeight.value)
                    ? `${headerWrapperHeight.value}px`
                    : 0,
            paddingBottom: `${footerEnable && footerFixed ? footerHeight : 0}px`
        }
    })

    /** 底部宽度 */
    const footerWidth = computed(() => {
        if (!props.footerFixed) {
            return '100%'
        }

        return mainStyle.value.width
    })

    /** watchs */
    {
        const checkHeaderIsHidden = useThrottleFn((top, bottom, topArrived) => {
            if (scrollY.value < headerWrapperHeight.value) {
                headerIsHidden.value = false
                return
            }

            if (topArrived) {
                headerIsHidden.value = false
                return
            }

            if (top) {
                headerIsHidden.value = false
            } else if (bottom) {
                headerIsHidden.value = true
            }
        }, 300)

        watch(
            () => scrollY.value,
            () => {
                if (props.headerMode !== 'auto-scroll' || isMixedNav.value || isFullContent.value) {
                    return
                }
                if (isScrolling.value) {
                    checkHeaderIsHidden(directions.top, directions.bottom, directions.top)
                }
            }
        )
    }

    watch(
        () => props.isMobile,
        (val) => {
            if (val) {
                sidebarCollapse.value = true
            }
        },
        { immediate: true }
    )

    watch(
        [() => headerWrapperHeight.value, () => isFullContent.value],
        ([height]) => {
            setLayoutHeaderHeight(isFullContent.value ? 0 : height)
        },
        {
            immediate: true
        }
    )

    watch(
        () => props.footerHeight,
        (height: number) => {
            setLayoutFooterHeight(height)
        },
        {
            immediate: true
        }
    )

    {
        const mouseMove = () => {
            headerIsHidden.value = mouseY.value > headerWrapperHeight.value
        }

        watch(
            [() => props.headerMode, () => mouseY.value],
            () => {
                if (!isHeaderAutoMode.value || isMixedNav.value || isFullContent.value) {
                    if (props.headerMode !== 'auto-scroll') {
                        headerIsHidden.value = false
                    }
                    return
                }
                headerIsHidden.value = true
                mouseMove()
            },
            { immediate: true }
        )
    }

    /** functions */

    /** 显示遮罩 */
    function handleClickMask() {
        sidebarCollapse.value = true
    }

    /** 鼠标离开Sidebar */
    function handleMouseLeave() {
        emit('sideMouseLeave')
    }

    /** 切换侧边栏显示 */
    function handleHeaderToggle() {
        if (props.isMobile) {
            sidebarCollapse.value = false
        } else {
            emit('toggleSidebar')
        }
    }
</script>

<template>
    <div class="relative flex min-h-full w-full">
        <!-- 侧栏 -->
        <LayoutSidebar
            v-if="sidebarEnableState"
            v-model:collapse="sidebarCollapse"
            v-model:expand-on-hover="sidebarExpandOnHover"
            v-model:expand-on-hovering="sidebarExpandOnHovering"
            v-model:extra-collapse="sidebarExtraCollapse"
            v-model:extra-visible="sidebarExtraVisible"
            :show-collapse-button="sidebarCollapsedButton"
            :show-fixed-button="sidebarFixedButton"
            :collapse-width="getSideCollapseWidth"
            :dom-visible="!isMobile"
            :extra-width="sidebarExtraWidth"
            :fixed-extra="sidebarExpandOnHover"
            :header-height="isMixedNav ? 0 : headerHeight"
            :is-sidebar-mixed="isSidebarMixedNav || isHeaderMixedNav"
            :margin-top="sidebarMarginTop"
            :mixed-width="sidebarMixedWidth"
            :show="showSidebar"
            :theme="sidebarTheme"
            :width="getSidebarWidth"
            :z-index="sidebarZIndex"
            @leave="handleMouseLeave"
        >
            <template v-if="isSideMode && !isMixedNav" #logo>
                <slot name="logo"></slot>
            </template>

            <template v-if="isSidebarMixedNav || isHeaderMixedNav">
                <slot name="mixed-menu"></slot>
            </template>
            <template v-else>
                <slot name="menu"></slot>
            </template>

            <template #extra>
                <slot name="side-extra"></slot>
            </template>
            <template #extra-title>
                <slot name="side-extra-title"></slot>
            </template>
        </LayoutSidebar>

        <!-- 主体内容 -->
        <div
            ref="contentRef"
            class="flex flex-1 flex-col overflow-hidden bg-gray-950 transition-all duration-300 ease-in"
        >
            <!-- 头部和导航栏 -->
            <div
                :class="[
                    {
                        'shadow-[0_16px_24px_hsl(var(--background))]': scrollY > 20
                    },
                    SCROLL_FIXED_CLASS
                ]"
                :style="headerWrapperStyle"
                class="overflow-hidden transition-all duration-200"
            >
                <!-- 右侧头部 -->
                <LayoutHeader
                    v-if="headerVisible"
                    :full-width="!isSideMode"
                    :height="headerHeight"
                    :is-mobile="isMobile"
                    :show="!isFullContent && !headerHidden"
                    :sidebar-width="sidebarWidth"
                    :theme="headerTheme"
                    :width="mainStyle.width"
                    :z-index="headerZIndex"
                >
                    <template v-if="showHeaderLogo" #logo>
                        <slot name="logo"></slot>
                    </template>

                    <template #toggle-button>
                        <DagIconButton
                            v-if="showHeaderToggleButton"
                            class="my-0 mr-1 rounded-md"
                            @click="handleHeaderToggle"
                        >
                            <Menu class="size-4" />
                        </DagIconButton>
                    </template>

                    <slot name="header"></slot>
                </LayoutHeader>

                <!-- 右侧导航栏 -->
                <LayoutTabbar v-if="tabbarEnable" :height="tabbarHeight" :style="tabbarStyle">
                    <slot name="tabbar"></slot>
                </LayoutTabbar>
            </div>

            <!-- 右侧主内容 -->
            <LayoutContent
                :id="idMainContent"
                :content-compact="contentCompact"
                :content-compact-width="contentCompactWidth"
                :padding="contentPadding"
                :padding-bottom="contentPaddingBottom"
                :padding-left="contentPaddingLeft"
                :padding-right="contentPaddingRight"
                :padding-top="contentPaddingTop"
                :style="contentStyle"
                class="transition-[margin-top] duration-200"
            >
                <slot name="content"></slot>

                <template #overlay>
                    <slot name="content-overlay"></slot>
                </template>
            </LayoutContent>

            <!-- 右侧底部 -->
            <LayoutFooter
                v-if="footerEnable"
                :fixed="footerFixed"
                :height="footerHeight"
                :show="!isFullContent"
                :width="footerWidth"
                :z-index="zIndex"
            >
                <slot name="footer"></slot>
            </LayoutFooter>
        </div>
        <!-- 扩展 -->
        <slot name="extra"></slot>
        <!-- 遮罩 -->
        <div
            v-if="maskVisible"
            :style="maskStyle"
            class="bg-overlay fixed top-0 h-full w-full transition-[background-color] duration-200"
            @click="handleClickMask"
        ></div>
    </div>
</template>
