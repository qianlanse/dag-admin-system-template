<script setup lang="ts">
    import type { NotificationItem } from '@dag/layouts'

    import { computed, ref } from 'vue'

    import { BookOpenText, CircleHelp, MdiGithub } from '@dag/icons'
    import { BasicLayout, Notification, UserDropdown } from '@dag/layouts'
    import { $t } from '@dag/locales'
    import { preferences } from '@dag/preferences'
    import { useUserStore } from '@dag/stores'
    import { openWindow } from '@dag/utils'

    const notifications = ref<NotificationItem[]>([
        {
            avatar: 'https://avatar.vercel.sh/vercel.svg?text=VB',
            date: '3小时前',
            isRead: true,
            message: '描述信息描述信息描述信息',
            title: '收到了 14 份新周报'
        },
        {
            avatar: 'https://avatar.vercel.sh/1',
            date: '刚刚',
            isRead: false,
            message: '描述信息描述信息描述信息',
            title: '朱偏右 回复了你'
        },
        {
            avatar: 'https://avatar.vercel.sh/1',
            date: '2024-01-01',
            isRead: false,
            message: '描述信息描述信息描述信息',
            title: '曲丽丽 评论了你'
        },
        {
            avatar: 'https://avatar.vercel.sh/satori',
            date: '1天前',
            isRead: false,
            message: '描述信息描述信息描述信息',
            title: '代办提醒'
        }
    ])

    const userStore = useUserStore()

    const showDot = computed(() => notifications.value.some((item) => !item.isRead))

    const avatar = computed(() => userStore.userInfo?.avatar ?? preferences.app.defaultAvatar)

    const menus = computed(() => [
        {
            handler: () => {
                openWindow('https://www.baidu.com', {
                    target: '_blank'
                })
            },
            icon: BookOpenText,
            text: $t('ui.widgets.document')
        },
        {
            handler: () => {
                openWindow('https://www.github.com', {
                    target: '_blank'
                })
            },
            icon: MdiGithub,
            text: 'GitHub'
        },
        {
            handler: () => {
                openWindow('https://www.google.com', {
                    target: '_blank'
                })
            },
            icon: CircleHelp,
            text: $t('ui.widgets.qa')
        }
    ])

    function handleNoticeClear() {
        notifications.value = []
    }

    function handleMakeAll() {
        notifications.value.forEach((item) => (item.isRead = true))
    }
</script>

<template>
    <BasicLayout>
        <template #user-dropdown>
            <UserDropdown
                :avatar
                :menus
                :text="userStore.userInfo?.realName"
                description="hefangjay@qq.com"
                tag-text="Pro"
            />
        </template>
        <template #notification>
            <Notification
                :dot="showDot"
                :notifications="notifications"
                @clear="handleNoticeClear"
                @make-all="handleMakeAll"
            />
        </template>
    </BasicLayout>
</template>
