<script setup lang="ts">
    import type { VNode } from 'vue'
    import type {
        RouteLocationNormalizedLoaded,
        RouteLocationNormalizedLoadedGeneric
    } from 'vue-router'

    import { computed } from 'vue'

    import { preferences, usePreferences } from '@dag/preferences'
    import { getTabKey, storeToRefs, useTabbarStore } from '@dag/stores'

    defineOptions({
        name: 'LayoutContent'
    })

    const { keepAlive } = usePreferences()
    const tabbarStore = useTabbarStore()
    const { getCachedTabs, getExcludeCachedTabs, renderRouteView } = storeToRefs(tabbarStore)

    const getEnabledTransition = computed(() => {
        const { transition } = preferences
        const transitionName = transition.name
        return transitionName && transition.enable
    })

    /** 页面切换动画 */
    function getTransitionName(_route: RouteLocationNormalizedLoaded) {
        // 如果偏好设置未设置则不使用动画
        const { tabbar, transition } = preferences
        const transitionName = transition.name
        if (!transitionName || !transition.enable) {
            return
        }

        // 标签页未启用或者未开启缓存则使用全局配置动画
        if (!tabbar.enable || !keepAlive) {
            return transitionName
        }

        return transitionName
    }

    /** 转换组件自动添加name */
    function transformComponent(component: VNode, route: RouteLocationNormalizedLoadedGeneric) {
        // 组件视图未找到则抛出错误
        if (!component) {
            console.error('Component view not found, please check the route configuration')
            return undefined
        }

        // 如果组件没有name则直接返回
        const routeName = route.name as string
        if (!routeName) {
            return component
        }

        const componentName = (component?.type as any)?.name

        // 已经设置过name则直接返回
        if (componentName) {
            return component
        }

        // componentName与routeName一致则直接返回
        if (componentName === routeName) {
            return component
        }

        // 设置name
        component.type ||= {}
        ;(component.type as any).name = routeName

        return component
    }
</script>

<template>
    <div class="relative h-full">
        <RouterView v-slot="{ Component, route }">
            <Transition
                v-if="getEnabledTransition"
                appear
                mode="out-in"
                :name="getTransitionName(route)"
            >
                <KeepAlive
                    v-if="keepAlive"
                    :exclude="getExcludeCachedTabs"
                    :include="getCachedTabs"
                >
                    <component
                        v-if="renderRouteView"
                        v-show="!route.meta.iframeSrc"
                        :is="transformComponent(Component, route)"
                        :key="getTabKey(route)"
                    />
                </KeepAlive>
                <component :is="Component" v-else-if="renderRouteView" :key="getTabKey(route)" />
            </Transition>
            <template v-else>
                <KeepAlive
                    v-if="keepAlive"
                    :exclude="getExcludeCachedTabs"
                    :include="getCachedTabs"
                >
                    <component
                        v-if="renderRouteView"
                        v-show="!route.meta.iframeSrc"
                        :is="transformComponent(Component, route)"
                        :key="getTabKey(route)"
                    />
                </KeepAlive>
                <component :is="Component" v-else-if="renderRouteView" :key="getTabKey(route)" />
            </template>
        </RouterView>
    </div>
</template>
