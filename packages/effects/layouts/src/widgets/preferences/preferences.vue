<script setup lang="ts">
    import { Settings } from '@dag/icons'
    import { $t } from '@dag/locales'

    import { DagButton } from '@dag-core/shadcn-ui'

    /** 打开侧栏配置 */
    function handleOpenDrawer() {
        // eslint-disable-next-line no-console
        console.log('open drawer preferences')
    }
</script>

<template>
    <div>
        <div @click="handleOpenDrawer">
            <slot>
                <DagButton
                    :title="$t('preferences.title')"
                    class="bg-primary flex-col-center size-10 cursor-pointer rounded-l-lg rounded-r-none border-none"
                >
                    <Settings class="size-5" />
                </DagButton>
            </slot>
        </div>
    </div>
</template>
