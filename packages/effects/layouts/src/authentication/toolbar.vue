<script setup lang="ts">
    import type { ToolbarType } from './types'

    import { computed } from 'vue'

    import { AuthenticationColorToggle } from '../widgets'

    interface Props {
        toolbarList?: ToolbarType[]
    }

    defineOptions({
        name: 'AuthenticationToolbar'
    })

    const props = withDefaults(defineProps<Props>(), {
        toolbarList: () => ['color', 'language', 'layout', 'theme']
    })

    const showColor = computed(() => props.toolbarList.includes('color'))
</script>

<template>
    <div
        :class="{
            'bg-accent rounded-3xl px-3 py-1': toolbarList.length > 1
        }"
        class="flex-center absolute right-2 top-4 z-10"
    >
        <div class="hidden md:flex">
            <AuthenticationColorToggle v-if="showColor" />
        </div>
    </div>
</template>
