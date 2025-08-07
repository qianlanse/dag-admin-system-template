import type { EChartsOption } from 'echarts'

import type { Ref } from 'vue'

import type { Nullable } from '@dag/types'

import type EchartsUI from './echarts-ui.vue'

import { computed, nextTick, watch } from 'vue'

import { usePreferences } from '@dag/preferences'

import {
    tryOnUnmounted,
    useDebounceFn,
    useResizeObserver,
    useTimeoutFn,
    useWindowSize
} from '@vueuse/core'

import echarts from './echarts'

type EchartsUIType = typeof EchartsUI | undefined

type EchartsThemeType = 'dark' | 'light' | null

function useEcharts(chartRef: Ref<EchartsUIType>) {
    let chartInstance: echarts.ECharts | null = null
    let cacheOptions: EChartsOption = {}

    const { isDark } = usePreferences()
    const { width, height } = useWindowSize()
    const resizeHandler: () => void = useDebounceFn(resize, 200)

    /** 获取Echart样式配置 */
    const getOptions = computed((): EChartsOption => {
        if (!isDark.value) {
            return {}
        }

        return {
            backgroundColor: 'transparent'
        }
    })

    /** 初始化Echart */
    function initCharts(t?: EchartsThemeType) {
        const el = chartRef?.value?.$el
        if (!el) {
            return
        }

        chartInstance = echarts.init(el, t || isDark.value ? 'dark' : null)

        return chartInstance
    }

    /** 渲染Echart */
    function renderEcharts(
        options: EChartsOption,
        clear = true
    ): Promise<Nullable<echarts.ECharts>> {
        cacheOptions = options
        const currentOptions = {
            ...options,
            ...getOptions.value
        }

        return new Promise((resolve) => {
            // 验证是否初始化成功
            if (chartRef.value?.offsetHeight === 0) {
                useTimeoutFn(async () => {
                    resolve(await renderEcharts(currentOptions))
                }, 30)
                return
            }

            nextTick(() => {
                useTimeoutFn(() => {
                    if (!chartInstance) {
                        const instance = initCharts()
                        if (!instance) return
                    }
                    clear && chartInstance?.clear()
                    chartInstance?.setOption(currentOptions)
                    resolve(chartInstance)
                }, 30)
            })
        })
    }

    /** 屏幕大小改变 */
    function resize() {
        chartInstance?.resize({
            animation: {
                duration: 300,
                easing: 'quadraticIn'
            }
        })
    }

    watch([width, height], () => {
        resizeHandler()
    })

    watch(isDark, () => {
        if (chartInstance) {
            chartInstance.dispose()
            initCharts()
            renderEcharts(cacheOptions)
            resize()
        }
    })

    useResizeObserver(chartRef as never, resizeHandler)

    tryOnUnmounted(() => {
        chartInstance?.dispose()
    })

    return {
        renderEcharts,
        resize,
        getCharInstance: () => chartInstance
    }
}

export { useEcharts }

export type { EchartsUIType }
