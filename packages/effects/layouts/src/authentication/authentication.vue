<script setup lang="ts">
    import type { ToolbarType } from './types'

    import Toolbar from './toolbar.vue'

    interface Props {
        appName?: string
        logo?: string
        pageTitle?: string
        pageDescription?: string
        sloganImage?: string
        toolbar?: boolean
        copyright?: boolean
        toolbarList?: ToolbarType[]
    }

    withDefaults(defineProps<Props>(), {
        appName: '',
        copyright: true,
        logo: '',
        pageDescription: '',
        pageTitle: '',
        sloganImage: '',
        toolbar: true,
        toolbarList: () => ['color', 'language', 'layout', 'theme']
    })
</script>

<template>
    <div class="flex min-h-full flex-1 select-none overflow-x-hidden">
        <template v-if="toolbar">
            <slot name="toolbar">
                <Toolbar :toolbar-list="toolbarList" />
            </slot>
        </template>
    </div>
</template>
