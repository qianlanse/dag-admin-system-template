<script setup lang="ts">
    import type { Component } from 'vue'

    import type { AnyFunction } from '@dag/types'

    import { computed, useTemplateRef, watch } from 'vue'

    import { useHoverToggle } from '@dag/hooks'
    import { LockKeyhole, LogOut } from '@dag/icons'
    import { $t } from '@dag/locales'
    import { preferences, usePreferences } from '@dag/preferences'
    import { useAccessStore } from '@dag/stores'
    import { isWindowsOs } from '@dag/utils'

    import { useDagModal } from '@dag-core/popup-ui'
    import {
        Badge,
        DagAvatar,
        DagIcon,
        DropdownMenu,
        DropdownMenuContent,
        DropdownMenuItem,
        DropdownMenuLabel,
        DropdownMenuSeparator,
        DropdownMenuShortcut,
        DropdownMenuTrigger
    } from '@dag-core/shadcn-ui'

    import { useMagicKeys, whenever } from '@vueuse/core'

    import { LockScreenModal } from '../lock-screen'

    interface Props {
        /** 头像 */
        avatar?: string
        /** 描述 */
        description?: string
        /** 是否启用快捷键 */
        enableShortcutKey?: boolean
        /** 菜单数组 */
        menus?: Array<{
            handler: AnyFunction
            icon?: Component | Function | string
            text: string
        }>
        /** 标签文本 */
        tagText?: string
        /** 文本 */
        text?: string
        /** 触发方式 */
        trigger?: 'both' | 'click' | 'hover'
        /** 延迟响应的时间 */
        hoverDelay?: number
    }

    defineOptions({
        name: 'UserDropdown'
    })

    const props = withDefaults(defineProps<Props>(), {
        avatar: '',
        description: '',
        enableShortcutKey: true,
        menus: () => [],
        tagText: '',
        text: '',
        trigger: 'click',
        hoverDelay: 500
    })

    const emit = defineEmits<{ logout: [] }>()

    const { globalLogoutShortcutKey, globalLockScreenShortcutKey } = usePreferences()
    const accessStore = useAccessStore()

    const refTrigger = useTemplateRef('refTrigger')
    const refContent = useTemplateRef('refContent')

    const [openPopover, hoverWatcher] = useHoverToggle(
        [refTrigger, refContent],
        () => props.hoverDelay
    )

    const [LogoutModal, logoutModalApi] = useDagModal({
        onConfirm() {
            handleSubmitLogout()
        }
    })
    const [LockModal, lockModalApi] = useDagModal({
        connectedComponent: LockScreenModal
    })

    /** 是否打开登出快捷键 */
    const enableLogoutShortcutKey = computed(
        () => props.enableShortcutKey && globalLogoutShortcutKey.value
    )

    /** 是否打开锁屏快捷键 */
    const enableLockScreenShortcutKey = computed(() => {
        return props.enableShortcutKey && globalLockScreenShortcutKey.value
    })

    /** 是否打开快捷键 */
    const enableShortcutKey = computed(
        () => props.enableShortcutKey && preferences.shortcutKeys.enable
    )

    const altView = computed(() => (isWindowsOs() ? 'Alt' : '⌥'))

    watch(
        () => props.trigger === 'hover' || props.trigger === 'both',
        (val) => {
            if (val) {
                hoverWatcher.enable()
            } else {
                hoverWatcher.disable()
            }
        },
        { immediate: true }
    )

    if (enableShortcutKey.value) {
        const keys = useMagicKeys()
        whenever(keys['Alt+KeyQ']!, () => {
            if (enableLogoutShortcutKey.value) {
                handleLogout()
            }
        })

        whenever(keys['Alt+KeyL']!, () => {
            if (enableLockScreenShortcutKey.value) {
                handleOpenLock()
            }
        })
    }

    /** 锁定屏幕 */
    function handleOpenLock() {
        lockModalApi.open()
    }

    /** 登出 */
    function handleLogout() {
        logoutModalApi.open()
        openPopover.value = false
    }

    /** 登出 */
    function handleSubmitLogout() {
        emit('logout')
        logoutModalApi.close()
    }

    /** 锁屏 */
    function handleSubmitLock(lockScreenPassword: string) {
        lockModalApi.close()
        accessStore.lockScreen(lockScreenPassword)
    }
</script>

<template>
    <LockModal
        v-if="preferences.widget.lockScreen"
        :avatar="avatar"
        :text="text"
        @submit="handleSubmitLock"
    />
    <!-- 登出确认框 -->
    <LogoutModal
        :cancel-text="$t('common.cancel')"
        :confirm-text="$t('common.confirm')"
        :fullscreen-button="false"
        :title="$t('common.prompt')"
        centered
        content-class="px-8 min-h-10"
        footer-class="border-none mb-3 mr-3"
        header-class="border-none"
    >
        {{ $t('ui.widgets.logoutTip') }}
    </LogoutModal>

    <!-- 用户弹窗 -->
    <DropdownMenu v-model:open="openPopover">
        <DropdownMenuTrigger ref="refTrigger" :disabled="props.trigger === 'hover'">
            <div class="hover:bg-accent ml-1 mr-2 cursor-pointer rounded-full p-1.5">
                <div class="hover:text-accent-foreground flex-center">
                    <DagAvatar :alt="text" :src="avatar" class="size-8" dot />
                </div>
            </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent class="mr-2 min-w-[240px] p-0 pb-1">
            <div ref="refContent">
                <!-- 个人简介 -->
                <DropdownMenuLabel class="flex items-center p-3">
                    <DagAvatar
                        :alt="text"
                        :src="avatar"
                        class="size-12"
                        dot
                        dot-class="bottom-0 right-1 border-2 size-4 bg-green-500"
                    />
                    <div class="ml-2 w-full">
                        <div
                            v-if="tagText || text || $slots.tagText"
                            class="text-foreground mb-1 flex items-center text-sm font-medium"
                        >
                            {{ text }}
                            <slot name="tagText">
                                <Badge v-if="tagText" class="ml-2 text-green-400">
                                    {{ tagText }}
                                </Badge>
                            </slot>
                        </div>
                        <div class="text-muted-foreground text-xs font-normal">
                            {{ description }}
                        </div>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator v-if="menus?.length" />
                <!-- 导航 -->
                <DropdownMenuItem
                    v-for="menu in menus"
                    :key="menu.text"
                    class="mx-1 flex cursor-pointer items-center rounded-sm py-1 leading-8"
                    @click="menu.handler"
                >
                    <DagIcon :icon="menu.icon" class="mr-2 size-4" />
                    {{ menu.text }}
                </DropdownMenuItem>
                <DropdownMenuSeparator />

                <DropdownMenuItem
                    v-if="preferences.widget.lockScreen"
                    class="mx-1 flex cursor-pointer items-center rounded-sm py-1 leading-8"
                    @click="handleOpenLock"
                >
                    <LockKeyhole class="mr-2 size-4" />
                    {{ $t('ui.widgets.lockScreen.title') }}
                    <DropdownMenuShortcut v-if="enableLockScreenShortcutKey">
                        {{ altView }} L
                    </DropdownMenuShortcut>
                </DropdownMenuItem>

                <DropdownMenuSeparator v-if="preferences.widget.lockScreen" />

                <DropdownMenuItem
                    class="mx-1 flex cursor-pointer items-center rounded-sm py-1 leading-8"
                    @click="handleLogout"
                >
                    <LogOut class="mr-2 size-4" />
                    {{ $t('common.logout') }}
                    <DropdownMenuShortcut v-if="enableLogoutShortcutKey">
                        {{ altView }} Q
                    </DropdownMenuShortcut>
                </DropdownMenuItem>
            </div>
        </DropdownMenuContent>
    </DropdownMenu>
</template>
