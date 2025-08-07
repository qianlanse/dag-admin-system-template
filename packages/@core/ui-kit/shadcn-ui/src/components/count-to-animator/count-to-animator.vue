<script setup lang="ts">
    import { computed, onMounted, ref, unref, watch, watchEffect } from 'vue'

    import { isNumber } from '@dag-core/shared/utils'

    import { TransitionPresets, useTransition } from '@vueuse/core'

    interface Props {
        /** 是否自动执行 */
        autoplay?: boolean
        /** 颜色 */
        color?: string
        /** 小数点字符 */
        decimal?: string
        /** 小数后几位 */
        decimals?: number
        /** 时长 */
        duration?: number
        /** 最终值 */
        endVal?: number
        /** 前缀 */
        prefix?: string
        /** 分离字符 */
        separator?: string
        /** 开始值 */
        startVal?: number
        /** 后缀 */
        suffix?: string
        /** 动画类型 */
        transition?: keyof typeof TransitionPresets
        /** 是否有动画 */
        useEasing?: boolean
    }

    defineOptions({
        name: 'CountToAnimator'
    })

    const props = withDefaults(defineProps<Props>(), {
        autoplay: true,
        color: '',
        decimal: '.',
        decimals: 0,
        duration: 1500,
        endVal: 2025,
        prefix: '',
        separator: ',',
        startVal: 0,
        suffix: '',
        transition: 'linear',
        useEasing: true
    })

    const emit = defineEmits<{
        finished: []
        onFinished: []
        onStarted: []
        started: []
    }>()

    const source = ref(props.startVal)
    const disabled = ref(false)
    let outputValue = useTransition(source)

    const value = computed(() => formatNumber(unref(outputValue)))

    watch([() => props.startVal, () => props.endVal], () => {
        if (props.autoplay) {
            start()
        }
    })

    watchEffect(() => {
        source.value = props.startVal
    })

    onMounted(() => {
        props.autoplay && start()
    })

    /** 开始动画 */
    function start() {
        run()
        source.value = props.endVal
    }

    /** 重置 */
    function reset() {
        source.value = props.startVal
        run()
    }

    /** 运行动画 */
    function run() {
        outputValue = useTransition(source, {
            disabled,
            duration: props.duration,
            onFinished: () => {
                emit('finished')
                emit('onFinished')
            },
            onStarted: () => {
                emit('started')
                emit('onStarted')
            },
            ...(props.useEasing
                ? {
                      transition: TransitionPresets[props.transition]
                  }
                : {})
        })
    }

    /** 格式化数据 */
    function formatNumber(num: number | string) {
        if (!num && num !== 0) {
            return ''
        }

        const { decimal, decimals, prefix, separator, suffix } = props
        num = Number(num).toFixed(decimals)
        num += ''

        const x = num.split('.')
        let x1 = x[0]
        const x2 = x.length > 1 ? decimal + x[1] : ''

        const rgx = /(\d+)(\d{3})/
        if (separator && !isNumber(separator) && x1) {
            while (rgx.test(x1)) {
                x1 = x1?.replace(rgx, `$1${separator}$2`)
            }
        }

        return prefix + x1 + x2 + suffix
    }

    defineExpose({
        reset
    })
</script>

<template>
    <span :style="{ color }">
        {{ value }}
    </span>
</template>
