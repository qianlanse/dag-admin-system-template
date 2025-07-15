<script setup lang="ts">
    import type { ExtendedModalApi, ModalProps } from './types'

    import { computed, nextTick, onDeactivated, provide, ref, unref, useId, watch } from 'vue'

    import { useIsMobile, usePriorityValues, useSimpleLocale } from '@dag-core/composables'
    import { Expand, Shrink } from '@dag-core/icons'
    import {
        DagButton,
        DagHelpTooltip,
        DagIconButton,
        DagLoading,
        Dialog,
        DialogContent,
        DialogDescription,
        DialogFooter,
        DialogHeader,
        DialogTitle,
        VisuallyHidden
    } from '@dag-core/shadcn-ui'
    import { ELEMENT_ID_MAIN_CONTENT } from '@dag-core/shared/constants'
    import { globalShareState } from '@dag-core/shared/global-state'
    import { cn } from '@dag-core/shared/utils'

    import { useModalDraggable } from './use-modal-draggable'

    interface Props extends ModalProps {
        modalApi?: ExtendedModalApi
    }

    const props = withDefaults(defineProps<Props>(), {
        appendToMain: false,
        destroyOnClose: false,
        modalApi: undefined
    })

    const components = globalShareState.getComponents()

    const contentRef = ref()
    const dialogRef = ref()
    const headerRef = ref()
    const footerRef = ref()
    const wrapperRef = ref<HTMLElement>()
    const isClosed = ref(true)
    const firstOpened = ref(false)

    const id = useId()

    provide('DISMISSABLE_MODAL_ID', id)

    const state = props.modalApi?.useStore?.()

    const { isMobile } = useIsMobile()
    const { $t } = useSimpleLocale()
    const {
        appendToMain,
        bordered,
        cancelText,
        centered,
        class: modalClass,
        closeable,
        closeOnClickModal,
        closeOnPressEscape,
        confirmDisabled,
        confirmLoading,
        confirmText,
        contentClass,
        description,
        destroyOnClose,
        draggable,
        footer: showFooter,
        footerClass,
        fullscreen,
        fullscreenButton,
        header,
        headerClass,
        loading: showLoading,
        modal,
        openAutoFocus,
        overlayBlur,
        showCancelButton,
        showConfirmButton,
        submitting,
        title,
        titleTooltip,
        zIndex
    } = usePriorityValues(props, state)

    const getAppendTo = computed(() => {
        return appendToMain.value ? `#${ELEMENT_ID_MAIN_CONTENT}>div:not(.absolute)>div` : undefined
    })

    const shouldFullscreen = computed(() => (fullscreen.value && header.value) || isMobile.value)

    const shouldDraggable = computed(
        () => draggable.value && !shouldFullscreen.value && header.value
    )

    const { dragging, transform } = useModalDraggable(
        dialogRef,
        headerRef,
        shouldDraggable,
        getAppendTo
    )

    const getForceMount = computed(() => !unref(destroyOnClose) && unref(firstOpened))

    watch(
        () => state?.value?.isOpen,
        async (val) => {
            if (val) {
                isClosed.value = false
                if (!firstOpened.value) firstOpened.value = true
                await nextTick()
                if (!contentRef.value) return
                const innerContentRef = contentRef.value.getContentRef()
                dialogRef.value = innerContentRef.$el
                const { offsetX, offsetY } = transform
                dialogRef.value.style.transform = `translate(${offsetX}px, ${offsetY}px)`
            }
        }
    )

    /** 若组件实例是 <KeepAlive> 缓存树的一部分，当组件从 DOM 中被移除时调用 */
    onDeactivated(() => {
        if (!appendToMain.value) {
            props.modalApi?.close()
        }
    })

    /** xxx */
    function handleFocusOutside(e: Event) {
        e.preventDefault()
        e.stopPropagation()
    }
    /** xxx */
    function handleClosed() {
        isClosed.value = true
        props.modalApi?.onClosed()
    }
    /** xxx */
    function escapeKeyDown(e: KeyboardEvent) {
        if (!closeOnPressEscape.value || submitting.value) {
            e.preventDefault()
        }
    }
    /** xxx */
    function interactOutside(e: Event) {
        if (!closeOnClickModal.value || submitting.value) {
            e.preventDefault()
            e.stopPropagation()
        }
    }
    /** xxx */
    function handleOpenAutoFocus(e: Event) {
        if (!openAutoFocus.value) {
            e?.preventDefault()
        }
    }
    /** xxx */
    function pointerDownOutside(e: Event) {
        const target = e.target as HTMLElement
        const isDismissableModal = target?.dataset.dismissableModal
        if (!closeOnClickModal.value || isDismissableModal !== id || submitting.value) {
            e.preventDefault()
            e.stopPropagation()
        }
    }

    /** 切换全屏显示 */
    function handleFullscreen() {
        props.modalApi?.setState((prev) => {
            return { ...prev, fullscreen: !fullscreen.value }
        })
    }
</script>

<template>
    <Dialog
        :modal="false"
        :open="state?.isOpen"
        @update:open="() => (!submitting ? modalApi?.close() : undefined)"
    >
        <DialogContent
            ref="contentRef"
            close-class="top-3"
            :append-to="getAppendTo"
            :class="
                cn(
                    'left-0 right-0 top-[10vh] mx-auto flex max-h-[80%] w-[520px] flex-col p-0',
                    shouldFullscreen ? 'sm:rounded-none' : 'sm:rounded-[var(--radius)]',
                    modalClass,
                    {
                        'border-border border': bordered,
                        'shadow-3xl': !bordered,
                        'left-0 top-0 size-full max-h-full !translate-x-0 !translate-y-0':
                            shouldFullscreen,
                        'top-1/2 !-translate-y-1/2': centered && !shouldFullscreen,
                        'duration-300': !dragging,
                        hidden: isClosed
                    }
                )
            "
            :force-mount="getForceMount"
            :modal="modal"
            :open="state?.isOpen"
            :show-close="closeable"
            :z-index="zIndex"
            :overlay-blur="overlayBlur"
            :close-disabled="submitting"
            @close-auto-focus="handleFocusOutside"
            @closed="handleClosed"
            @escape-key-down="escapeKeyDown"
            @focus-outside="handleFocusOutside"
            @interact-outside="interactOutside"
            @open-auto-focus="handleOpenAutoFocus"
            @opened="() => modalApi?.onOpened()"
            @pointer-down-outside="pointerDownOutside"
        >
            <!-- 顶部组件 -->
            <DialogHeader
                ref="headerRef"
                :class="
                    cn(
                        'px-5 py-4',
                        {
                            'border-b': bordered,
                            hidden: !header,
                            'cursor-move select-none': shouldDraggable
                        },
                        headerClass
                    )
                "
            >
                <!-- 标题组件 -->
                <DialogTitle v-if="title" class="text-left">
                    <slot name="title">
                        {{ title }}
                        <slot v-if="titleTooltip" name="titleTooltip">
                            <DagHelpTooltip trigger-class="pb-1">
                                {{ titleTooltip }}
                            </DagHelpTooltip>
                        </slot>
                    </slot>
                </DialogTitle>
                <!-- 描述组件 -->
                <DialogDescription v-if="description">
                    <slot name="description">
                        {{ description }}
                    </slot>
                </DialogDescription>
                <!-- xxx -->
                <VisuallyHidden v-if="!title || !description">
                    <DialogTitle v-if="!title" />
                    <DialogDescription v-if="!description" />
                </VisuallyHidden>
            </DialogHeader>
            <!-- 内容区域 -->
            <div
                ref="wrapperRef"
                :class="
                    cn('relative min-h-40 flex-1 overflow-y-auto p-3', contentClass, {
                        'pointer-events-none': showLoading || submitting
                    })
                "
            >
                <slot></slot>
            </div>
            <!-- Loading显示 -->
            <DagLoading v-if="showLoading || submitting" spinning />
            <!-- 全屏按钮 -->
            <DagIconButton
                v-if="fullscreenButton"
                class="hover:bg-accent hover:text-accent-foreground text-foreground/80 flex-center absolute right-10 top-3 hidden size-6 rounded-full px-1 text-lg opacity-70 transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none sm:block"
                @click="handleFullscreen"
            >
                <Shrink v-if="fullscreen" class="size-3.5" />
                <Expand v-else class="size-3.5" />
            </DagIconButton>
            <!-- 底部区域 -->
            <DialogFooter
                v-if="showFooter"
                ref="footerRef"
                :class="
                    cn(
                        'flex-row items-center justify-end p-2',
                        {
                            'border-t': bordered
                        },
                        footerClass
                    )
                "
            >
                <slot name="prepend-footer"></slot>
                <slot name="footer">
                    <component
                        :is="components.DefaultButton || DagButton"
                        v-if="showCancelButton"
                        variant="ghost"
                        :disabled="submitting"
                        @click="() => modalApi?.onCancel()"
                    >
                        <slot name="cancelText">
                            {{ cancelText || $t('cancel') }}
                        </slot>
                    </component>
                    <slot name="center-footer"></slot>
                    <component
                        :is="components.PrimaryButton || DagButton"
                        v-if="showConfirmButton"
                        :disabled="confirmDisabled"
                        :loading="confirmLoading || submitting"
                        @click="() => modalApi?.onConfirm()"
                    >
                        <slot name="confirmText">
                            {{ confirmText || $t('confirm') }}
                        </slot>
                    </component>
                </slot>
                <slot name="append-footer"></slot>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>
