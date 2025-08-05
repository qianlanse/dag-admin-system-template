<script setup lang="ts">
    import { onMounted, onUnmounted, ref } from 'vue'

    import { $t } from '@dag/locales'

    import { useDagModal } from '@dag-core/popup-ui'

    interface Props {
        checkUpdatesInterval?: number
        checkUpdateUrl?: string
    }

    defineOptions({
        name: 'CheckUpdates'
    })

    const props = withDefaults(defineProps<Props>(), {
        checkUpdatesInterval: 1,
        checkUpdateUrl: import.meta.env.BASE_URL || '/'
    })

    let isCheckingUpdates = false

    const timer = ref<ReturnType<typeof setInterval>>()
    const lastVersionTag = ref('')
    const currentVersionTag = ref('')

    const [UpdateNoticeModal, modalApi] = useDagModal({
        closeable: false,
        closeOnPressEscape: false,
        closeOnClickModal: false,
        onConfirm() {
            lastVersionTag.value = currentVersionTag.value
            window.location.reload()
        }
    })

    /** 获取版本信息 */
    async function getVersionTag() {
        try {
            if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
                return null
            }

            const response = await fetch(props.checkUpdateUrl, {
                cache: 'no-cache',
                method: 'HEAD',
                redirect: 'manual'
            })

            return response.headers.get('etag') || response.headers.get('last-modified')
        } catch {
            console.error('Failed to fetch version tag')
            return null
        }
    }

    /** 验证更新 */
    async function handleCheckForUpdates() {
        const versionTag = await getVersionTag()
        if (!versionTag) {
            return
        }

        if (!lastVersionTag.value) {
            lastVersionTag.value = versionTag
            return
        }

        if (lastVersionTag.value !== versionTag && versionTag) {
            clearInterval(timer.value)
            handleNotice(versionTag)
        }
    }

    /** 弹窗 */
    function handleNotice(versionTag: string) {
        currentVersionTag.value = versionTag
        modalApi.open()
    }

    /** 初始化验证 */
    function handleStart() {
        if (props.checkUpdatesInterval <= 0) {
            return
        }

        timer.value = setInterval(handleCheckForUpdates, props.checkUpdatesInterval * 60 * 1000)
    }

    /** 清除定时 */
    function handleStop() {
        clearInterval(timer.value)
    }

    /** 停止 */
    function handleVisibilityChange() {
        if (document.hidden) {
            handleStop()
        } else {
            if (!isCheckingUpdates) {
                isCheckingUpdates = true
                handleCheckForUpdates().finally(() => {
                    isCheckingUpdates = false
                    handleStart()
                })
            }
        }
    }

    onMounted(() => {
        handleStart()
        document.addEventListener('visibilitychange', handleVisibilityChange)
    })

    onUnmounted(() => {
        handleStop()
        document.removeEventListener('visibilitychange', handleVisibilityChange)
    })
</script>

<template>
    <UpdateNoticeModal
        :cancel-text="$t('common.cancel')"
        :confirm-text="$t('common.refresh')"
        :fullscreen-button="false"
        :title="$t('ui.widgets.checkUpdatesTitle')"
        centered
        content-class="px-8 min-h-10"
        footer-class="border-none mb-3 mr-3"
        header-class="border-none"
    >
        {{ $t('ui.widgets.checkUpdatesDescription') }}
    </UpdateNoticeModal>
</template>
