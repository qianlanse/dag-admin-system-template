<script setup lang="ts">
    import type { DialogContentEmits, DialogContentProps } from 'radix-vue'

    import type { CSSProperties } from 'vue'

    import type { SheetVariants } from './sheet-cva'

    import { computed, ref } from 'vue'

    import { cn } from '@dag-core/shared/utils'

    import { DialogContent, DialogPortal, useForwardPropsEmits } from 'radix-vue'

    import { sheetVariants } from './sheet-cva'
    import SheetOverlay from './SheetOverlay.vue'

    interface SheetContentProps extends DialogContentProps {
        appendTo?: HTMLElement | string
        class?: any
        modal?: boolean
        open?: boolean
        overlayBlur?: number
        side?: SheetVariants['side']
        zIndex?: number
    }

    defineOptions({
        inheritAttrs: false
    })

    const props = withDefaults(defineProps<SheetContentProps>(), {
        appendTo: 'body'
    })

    const emits = defineEmits<DialogContentEmits & { close: []; closed: []; opened: [] }>()

    const contentRef = ref<InstanceType<typeof DialogContent> | null>(null)

    const delegatedProps = computed(() => {
        const { class: _, modal: __, open: ___, side: ____, ...delegated } = props

        return delegated
    })

    const position = computed(() => (isAppendToBody() ? 'fixed' : 'absolute'))

    const overlayStyle = computed(
        (): CSSProperties => ({
            ...(props.zIndex ? { zIndex: props.zIndex } : {}),
            position: position.value,
            backdropFilter:
                props.overlayBlur && props.overlayBlur > 0 ? `blur(${props.overlayBlur}px)` : 'none'
        })
    )

    const forwarded = useForwardPropsEmits(delegatedProps, emits)

    function isAppendToBody() {
        return props.appendTo === 'body' || props.appendTo === document.body || !props.appendTo
    }

    /** 动画结束时触发opened/closed事件 */
    function onAnimationEnd(event: AnimationEvent) {
        if (event.target === contentRef.value?.$el) {
            if (props.open) {
                emits('opened')
            } else {
                emits('closed')
            }
        }
    }
</script>

<template>
    <DialogPortal>
        <Transition name="fade">
            <SheetOverlay v-if="open && modal" :style="overlayStyle" />
        </Transition>
        <DialogContent
            ref="contentRef"
            :class="cn('z-popup', sheetVariants({ side }), props.class)"
            :style="{
                ...(zIndex ? { zIndex } : {}),
                position
            }"
            @animationend="onAnimationEnd"
            v-bind="{ ...forwarded, ...$attrs }"
        >
            <slot></slot>
        </DialogContent>
    </DialogPortal>
</template>
