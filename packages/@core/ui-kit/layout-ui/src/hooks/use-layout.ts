import type { LayoutType } from '@dag-core/typings'

import type { DagLayoutProps } from '../types'

import { computed } from 'vue'

/** 获取导航布局类型 */
export function useLayout(props: DagLayoutProps) {
    const currentLayout = computed(() =>
        props.isMobile ? 'sidebar-nav' : (props.layout as LayoutType)
    )

    /** 是否全屏显示Content(不需要侧边、底部、顶部、tab区域) */
    const isFullContent = computed(() => currentLayout.value === 'full-content')

    /** 是否侧边混合模式 */
    const isSidebarMixedNav = computed(() => currentLayout.value === 'sidebar-mixed-nav')

    /** 是否头部导航模式 */
    const isHeaderNav = computed(() => currentLayout.value === 'header-nav')

    /** 是否为混合导航模式 */
    const isMixedNav = computed(
        () => currentLayout.value === 'mixed-nav' || currentLayout.value === 'header-sidebar-nav'
    )

    /** 是否为头部混合模式 */
    const isHeaderMixedNav = computed(() => currentLayout.value === 'header-mixed-nav')

    return {
        currentLayout,
        isFullContent,
        isHeaderMixedNav,
        isHeaderNav,
        isMixedNav,
        isSidebarMixedNav
    }
}
