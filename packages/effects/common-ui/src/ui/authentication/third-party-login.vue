<script setup lang="ts">
    import { MdiGithub, MdiGoogle, MdiQqchat, MdiWechat } from '@dag/icons'
    import { $t } from '@dag/locales'

    import { DagIconButton } from '@dag-core/shadcn-ui'

    defineOptions({
        name: 'ThirdPartyLogin'
    })
</script>

<template>
    <div class="w-full sm:mx-auto md:max-w-md">
        <div class="mt-4 flex items-center justify-between">
            <span class="border-input w-[35%] border-b dark:border-gray-600"></span>
            <span class="text-muted-foreground text-center text-xs uppercase">
                {{ $t('authentication.thirdPartyLogin') }}
            </span>
            <span class="border-input w-[35%] border-b dark:border-gray-600"></span>
        </div>

        <div class="mt-4 flex flex-wrap justify-center">
            <DagIconButton class="mb-3">
                <MdiWechat />
            </DagIconButton>
            <DagIconButton class="mb-3">
                <MdiQqchat />
            </DagIconButton>
            <DagIconButton class="mb-3">
                <MdiGithub />
            </DagIconButton>
            <DagIconButton class="mb-3">
                <MdiGoogle />
            </DagIconButton>
        </div>
    </div>
</template>
