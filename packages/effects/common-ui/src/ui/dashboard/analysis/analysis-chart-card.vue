<script setup lang="ts">
    import { Card, CardContent, CardHeader, CardTitle } from '@dag-core/shadcn-ui'

    defineOptions({
        name: 'AnalysisChartCard'
    })

    withDefaults(defineProps<{ title: string }>(), {})
</script>

<template>
    <Card>
        <CardHeader>
            <CardTitle class="text-xl">{{ title }}</CardTitle>
        </CardHeader>
        <CardContent>
            <slot></slot>
        </CardContent>
    </Card>
</template>
