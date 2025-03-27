<script setup lang="ts">
    import type {
        CaptchaVerifyPassingData,
        SliderCaptchaProps,
        SliderRotateVerifyPassingData
    } from '../types'

    import { reactive, unref, useTemplateRef, watch, watchEffect } from 'vue'

    import { $t } from '@dag/locales'

    import { cn } from '@dag-core/shared/utils'

    import { useTimeoutFn } from '@vueuse/core'

    import SliderCaptchaAction from './slider-captcha-action.vue'
    import SliderCaptchaBar from './slider-captcha-bar.vue'
    import SliderCaptchaContent from './slider-captcha-content.vue'

    const props = withDefaults(defineProps<SliderCaptchaProps>(), {
        actionStyle: () => ({}),
        barStyle: () => ({}),
        contentStyle: () => ({}),
        wrapperStyle: () => ({}),
        successText: '',
        text: '',
        isSlot: false
    })

    const emit = defineEmits<{
        end: [MouseEvent | TouchEvent]
        move: [SliderRotateVerifyPassingData]
        start: [MouseEvent | TouchEvent]
        success: [CaptchaVerifyPassingData]
    }>()

    const wrapperRef = useTemplateRef<HTMLDivElement>('wrapperRef')
    const barRef = useTemplateRef<typeof SliderCaptchaBar>('barRef')
    const contentRef = useTemplateRef<typeof SliderCaptchaContent>('contentRef')
    const actionRef = useTemplateRef<typeof SliderCaptchaAction>('actionRef')

    const modelValue = defineModel<boolean>({ default: false })

    const state = reactive({
        /** 是否完成 */
        isPassing: false,
        /** 是否移动中 */
        isMoving: false,
        /** 是否最坐标 */
        toLeft: false,
        /** 移动距离 */
        moveDistance: 0,
        /** 开始移动时间 */
        startTime: 0,
        /** 结束移动时间 */
        endTime: 0
    })

    watch(
        () => state.isPassing,
        (isPassing) => {
            if (isPassing) {
                const { endTime, startTime } = state
                const time = (endTime - startTime) / 1000
                emit('success', { isPassing, time: time.toFixed(1) })
                modelValue.value = isPassing
            }
        }
    )

    watchEffect(() => {
        state.isPassing = !!modelValue.value
    })

    defineExpose({
        resume
    })

    function getOffset(actionEl: HTMLDivElement) {
        const wrapperWidth = wrapperRef.value?.offsetWidth ?? 220
        const actionWidth = actionEl?.offsetWidth ?? 40
        const offset = wrapperWidth - actionWidth - 6
        return { actionWidth, offset, wrapperWidth }
    }

    function getEventPageX(evt: MouseEvent | TouchEvent): number {
        if ('pageX' in evt) {
            return evt.pageX
        } else if ('touches' in evt && evt.touches[0]) {
            return evt.touches[0].pageX
        }
        return 0
    }

    function checkPass() {
        if (props.isSlot) {
            resume()
            return
        }
        state.endTime = Date.now()
        state.isPassing = true
        state.isMoving = false
    }

    // 重置
    function resume() {
        state.isPassing = false
        state.isMoving = false
        state.toLeft = false
        state.moveDistance = 0
        state.startTime = 0
        state.endTime = 0
        const actionEl = unref(actionRef)
        const barEl = unref(barRef)
        const contentEl = unref(barRef)
        if (!actionEl || !barEl || !contentEl) return

        contentEl.getEl().style.width = '100%'
        state.toLeft = true
        useTimeoutFn(() => {
            state.toLeft = false
            actionEl.setLeft('0')
            barEl.setWidth('0')
        }, 300)
    }

    // 开始
    function handleDragStart(evt: MouseEvent | TouchEvent) {
        if (state.isPassing || !actionRef.value) {
            return
        }

        emit('start', evt)

        state.moveDistance =
            getEventPageX(evt) -
            Number.parseInt(actionRef.value.getStyle().left.replace('px', '') || '0', 10)
        state.startTime = Date.now()
        state.isMoving = true
    }

    // 拖动中
    function handleDragMoving(evt: MouseEvent | TouchEvent) {
        const { isMoving, moveDistance } = state
        if (isMoving) {
            const actionEl = unref(actionRef)
            const barEl = unref(barRef)
            if (!actionEl || !barEl) return
            const { actionWidth, offset, wrapperWidth } = getOffset(actionEl.getEl())
            const moveX = getEventPageX(evt) - moveDistance

            emit('move', { event: evt, moveDistance, moveX })

            if (moveX > 0 && moveX <= offset) {
                actionEl.setLeft(`${moveX}px`)
                barEl.setWidth(`${moveX + actionWidth / 2}px`)
            } else if (moveX > offset) {
                actionEl.setLeft(`${wrapperWidth - actionWidth}px`)
                barEl.setWidth(`${wrapperWidth - actionWidth / 2}px`)
                if (!props.isSlot) {
                    checkPass()
                }
            }
        }
    }

    // 结束
    function handleDragOver(evt: MouseEvent | TouchEvent) {
        const { isMoving, isPassing, moveDistance } = state
        if (isMoving && !isPassing) {
            emit('end', evt)
            const actionEl = unref(actionRef)
            const barEl = unref(barRef)
            if (!actionEl || !barEl) return
            const moveX = getEventPageX(evt) - moveDistance
            const { actionWidth, offset, wrapperWidth } = getOffset(actionEl.getEl())
            if (moveX < offset) {
                if (props.isSlot) {
                    setTimeout(() => {
                        if (modelValue.value) {
                            const contentEl = unref(contentRef)
                            if (contentEl) {
                                contentEl.getEl().style.width = `${Number.parseInt(barEl.getEl().style.width)}px`
                            }
                        } else {
                            resume()
                        }
                    }, 0)
                } else {
                    resume()
                }
            } else {
                actionEl.setLeft(`${wrapperWidth - actionWidth}px`)
                barEl.setWidth(`${wrapperWidth - actionWidth / 2}px`)
                checkPass()
            }
            state.isMoving = false
        }
    }
</script>

<template>
    <div
        ref="wrapperRef"
        :class="
            cn(
                'border-border bg-background-deep relative flex h-10 w-full items-center overflow-hidden rounded-md border text-center',
                props.class
            )
        "
        :style="wrapperStyle"
        @mouseleave="handleDragOver"
        @mousemove="handleDragMoving"
        @mouseup="handleDragOver"
        @touchend="handleDragOver"
        @touchmove="handleDragMoving"
    >
        <!-- 滑动值 -->
        <SliderCaptchaBar ref="barRef" :bar-style="barStyle" :to-left="state.toLeft" />

        <!-- 中间文本内容 -->
        <SliderCaptchaContent
            ref="contentRef"
            :content-style="contentStyle"
            :is-passing="state.isPassing"
            :success-text="successText || $t('ui.captcha.sliderSuccessText')"
            :text="text || $t('ui.captcha.sliderDefaultText')"
        >
            <template v-if="$slots.text" #text>
                <slot :is-passing="state.isPassing" name="text"></slot>
            </template>
        </SliderCaptchaContent>

        <!-- 拖动按钮 -->
        <SliderCaptchaAction
            ref="actionRef"
            :action-style="actionStyle"
            :is-passing="state.isPassing"
            :to-left="state.toLeft"
            @mousedown="handleDragStart"
            @touchstart="handleDragStart"
        >
            <template v-if="$slots.actionIcon" #icon>
                <slot :is-passing="state.isPassing" name="actionIcon"></slot>
            </template>
        </SliderCaptchaAction>
    </div>
</template>
