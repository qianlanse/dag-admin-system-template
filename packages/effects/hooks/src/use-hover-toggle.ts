import type { Arrayable, MaybeElementRef } from '@vueuse/core'

import type { Ref } from 'vue'

import { computed, effectScope, onUnmounted, ref, unref, watch } from 'vue'

import { isFunction } from '@dag/utils'

import { useElementHover } from '@vueuse/core'

interface HoverDelayOptions {
    /** 鼠标进入延长时间 */
    enterDelay?: (() => number) | number
    /** 鼠标离开延迟时间 */
    leaveDelay?: (() => number) | number
}

const DEFAULT_LEAVE_DELAY = 500
const DEFAULT_ENTER_DELAY = 0

/**
 * 监测鼠标是否在元素内部，如果在元素内部则返回 true，否则返回 false
 * @param refElement 所有需要检测的元素。支持单个元素、元素数组或响应式引用的元素数组。如果鼠标在任何一个元素内部都会返回 true
 * @param delay 延迟更新状态的时间，可以是数字或包含进入/离开延迟的配置对象
 * @returns 返回一个数组，第一个元素是一个 ref，表示鼠标是否在元素内部，第二个元素是一个控制器，可以通过 enable 和 disable 方法来控制监听器的启用和禁用
 */
export function useHoverToggle(
    refElement: Arrayable<MaybeElementRef> | Ref<HTMLElement[] | null>,
    delay: (() => number) | HoverDelayOptions | number = DEFAULT_LEAVE_DELAY
) {
    const normalizedOptions: HoverDelayOptions =
        typeof delay === 'number' || isFunction(delay)
            ? { enterDelay: DEFAULT_ENTER_DELAY, leaveDelay: delay }
            : { enterDelay: DEFAULT_ENTER_DELAY, leaveDelay: DEFAULT_LEAVE_DELAY, ...delay }

    const value = ref(false)
    const enterTimer = ref<ReturnType<typeof setTimeout> | undefined>()
    const leaveTimer = ref<ReturnType<typeof setTimeout> | undefined>()
    const hoverScopes = ref<ReturnType<typeof effectScope>[]>([])

    // 储存所有hover状态
    const isHovers = ref<Array<Ref<boolean>>>([])

    const refs = computed(() => {
        const raw = unref(refElement)
        if (raw === null) return []
        return Array.isArray(raw) ? raw : [raw]
    })

    const isOutsizeAll = computed(() => isHovers.value.every((v) => !v.value))

    const elementsCount = computed(() => {
        const raw = unref(refElement)
        if (raw === null) return 0
        return Array.isArray(raw) ? raw.length : 0
    })

    const stopWatcher = watch(elementsCount, updateHovers, { deep: false })

    const hoverWatcher = watch(isOutsizeAll, (val) => setValuesDelay(!val), { immediate: true })

    const controller = {
        enable() {
            hoverWatcher.resume()
        },
        disable() {
            hoverWatcher.pause()
        }
    }

    // 更新 hover 监听的函数
    function updateHovers() {
        // 停止并清理之前的作用域
        hoverScopes.value.forEach((scope) => scope.stop())
        hoverScopes.value = []

        isHovers.value = refs.value.map((refEle) => {
            if (!refEle) {
                return ref(false)
            }
            const eleRef = computed(() => {
                const ele = unref(refEle)
                return ele instanceof Element ? ele : (ele?.$el as Element)
            })

            // 为每个元素创建独立的作用域
            const scope = effectScope()
            const hoverRef = scope.run(() => useElementHover(eleRef)) || ref(false)
            hoverScopes.value.push(scope)

            return hoverRef
        })
    }

    /** 清空定时 */
    function clearTimers() {
        if (enterTimer.value) {
            clearTimeout(enterTimer.value)
            enterTimer.value = undefined
        }
        if (leaveTimer.value) {
            clearTimeout(leaveTimer.value)
            leaveTimer.value = undefined
        }
    }

    /** 设置延迟 */
    function setValuesDelay(val: boolean) {
        clearTimers()

        // 鼠标进入
        if (val) {
            const enterDelay = normalizedOptions.enterDelay ?? DEFAULT_ENTER_DELAY
            const delayTime = isFunction(enterDelay) ? enterDelay() : enterDelay

            if (delayTime <= 0) {
                value.value = true
            } else {
                enterTimer.value = setTimeout(() => {
                    value.value = true
                    enterTimer.value = undefined
                }, delayTime)
            }
            // 鼠标离开
        } else {
            const leaveDelay = normalizedOptions.leaveDelay ?? DEFAULT_LEAVE_DELAY
            const delayTime = isFunction(leaveDelay) ? leaveDelay() : leaveDelay

            if (delayTime <= 0) {
                value.value = false
            } else {
                leaveTimer.value = setTimeout(() => {
                    value.value = false
                    leaveTimer.value = undefined
                }, delayTime)
            }
        }
    }

    updateHovers()

    onUnmounted(() => {
        clearTimers()
        stopWatcher()
        hoverScopes.value.forEach((scope) => scope.stop())
    })

    return [value, controller] as [typeof value, typeof controller]
}
