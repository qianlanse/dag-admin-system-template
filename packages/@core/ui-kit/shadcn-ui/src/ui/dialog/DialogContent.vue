<script setup lang="ts">
    import type { DialogContentEmits, DialogContentProps } from 'radix-vue'

    import type { ClassType } from '@dag-core/typings'

    import { computed, ref } from 'vue'

    import { cn } from '@dag-core/shared/utils'

    import { X } from 'lucide-vue-next'
    import { DialogClose, DialogContent, DialogPortal, useForwardPropsEmits } from 'radix-vue'

    import DialogOverlay from './DialogOverlay.vue'

    interface Props extends DialogContentProps {
        appendTo?: HTMLElement | string
        class?: ClassType
        closeClass?: ClassType
        closeDisabled?: boolean
        modal?: boolean
        open?: boolean
        overlayBlur?: number
        showClose?: boolean
        zIndex?: number
    }

    const props = withDefaults(defineProps<Props>(), {
        appendTo: 'body',
        closeDisabled: false,
        showClose: true
    })
    const emits = defineEmits<DialogContentEmits & { close: []; closed: []; opened: [] }>()

    const contentRef = ref<InstanceType<typeof DialogContent> | null>(null)

    /** computed */
    const delegatedProps = computed(() => {
        const { class: _, modal: __, open: ___, showClose: ____, ...delegated } = props

        return delegated
    })

    const position = computed(() => {
        const { appendTo } = props
        return appendTo === 'body' || appendTo === document.body || !appendTo ? 'fixed' : 'absolute'
    })

    const overlayStyle = computed(() => {
        const { overlayBlur, zIndex } = props
        return {
            ...(zIndex ? { zIndex } : {}),
            backdropFilter: overlayBlur && overlayBlur > 0 ? `blur(${overlayBlur}px)` : 'none',
            position: position.value
        }
    })

    const contentStyle = computed(() => {
        const { zIndex } = props
        return {
            ...(zIndex ? { zIndex } : {}),
            position: position.value
        }
    })

    const forwarded = useForwardPropsEmits(delegatedProps, emits)

    /** functions */

    /** 关闭遮罩 */
    function handleCloseDialog() {
        emits('close')
    }

    /** 动画结束后触发回调 */
    function handleAnimationEnd(event: AnimationEvent) {
        if (event.target === contentRef.value?.$el) {
            if (props.open) {
                emits('opened')
            } else {
                emits('closed')
            }
        }
    }

    defineExpose({
        getContentRef: () => contentRef.value
    })
</script>

<template>
    <DialogPortal>
        <Transition name="fade">
            <DialogOverlay v-if="open && modal" :style="overlayStyle" @click="handleCloseDialog" />
        </Transition>
        <DialogContent
            ref="contentRef"
            :style="contentStyle"
            @animationend="handleAnimationEnd"
            v-bind="forwarded"
            :class="
                cn(
                    'z-popup bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-top-[48%] w-full p-6 shadow-lg outline-none sm:rounded-xl',
                    props.class
                )
            "
        >
            <slot></slot>
            <DialogClose
                v-if="showClose"
                :disabled="closeDisabled"
                :class="
                    cn(
                        'data-[state=open]:bg-accent data-[state=open]:text-muted-foreground hover:bg-accent hover:text-accent-foreground text-foreground/80 flex-center absolute right-3 top-3 h-6 w-6 rounded-full px-1 text-lg opacity-70 transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none',
                        props.closeClass
                    )
                "
                @click="handleCloseDialog"
            >
                <X class="size-4" />
            </DialogClose>
        </DialogContent>
    </DialogPortal>
</template>
