<script setup lang="ts">
    import type { Component } from 'vue'

    import { computed } from 'vue'

    import { IconDefault, IconifyIcon } from '@dag-core/icons'
    import { isFunction, isHttpUrl, isObject, isString } from '@dag-core/shared/utils'

    const props = defineProps<{
        // 没有是否显示默认图标
        fallback?: boolean
        icon?: Component | Function | string
    }>()

    const isComponent = computed(() => {
        const { icon } = props
        return !isString(icon) && (isObject(icon) || isFunction(icon))
    })

    const isRemoteIcon = computed(() => isString(props.icon) && isHttpUrl(props.icon))
</script>

<template>
    <component v-if="isComponent" :is="icon as Component" v-bind="$attrs" />
    <img v-else-if="isRemoteIcon" :src="icon as string" v-bind="$attrs" />
    <IconifyIcon v-else-if="icon" v-bind="$attrs" :icon="icon as string" />
    <IconDefault v-else-if="fallback" v-bind="$attrs" />
</template>
