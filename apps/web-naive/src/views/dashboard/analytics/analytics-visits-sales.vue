<script setup lang="ts">
    import type { EchartsUIType } from '@dag/plugins/echarts'

    import { onMounted, ref } from 'vue'

    import { EchartsUI, useEcharts } from '@dag/plugins/echarts'

    const echartRef = ref<EchartsUIType>()
    const { renderEcharts } = useEcharts(echartRef)

    onMounted(() => {
        renderEcharts({
            series: [
                {
                    animationDelay() {
                        return Math.random() * 400
                    },
                    animationEasing: 'exponentialInOut',
                    animationType: 'scale',
                    center: ['50%', '50%'],
                    color: ['#5ab1ef', '#b6a2de', '#67e0e3', '#2ec7c9'],
                    data: [
                        { name: '外包', value: 500 },
                        { name: '定制', value: 310 },
                        { name: '技术支持', value: 274 },
                        { name: '远程', value: 400 }
                    ].sort((a, b) => a.value - b.value),
                    name: '商业占比',
                    radius: '80%',
                    roseType: 'radius',
                    type: 'pie'
                }
            ],
            tooltip: {
                trigger: 'item'
            }
        })
    })
</script>

<template>
    <EchartsUI ref="echartRef" />
</template>
