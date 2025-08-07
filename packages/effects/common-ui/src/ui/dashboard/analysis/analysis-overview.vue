<script setup lang="ts">
    import type { AnalysisOverviewItem } from '../typing'

    import {
        Card,
        CardContent,
        CardFooter,
        CardHeader,
        CardTitle,
        DagCountToAnimator,
        DagIcon
    } from '@dag-core/shadcn-ui'

    interface Props {
        items?: AnalysisOverviewItem[]
    }
    defineOptions({
        name: 'AnalysisOverview'
    })

    const { items = [] } = defineProps<Props>()
</script>

<template>
    <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <template v-for="item in items" :key="item.title">
            <Card class="w-full">
                <CardHeader>
                    <CardTitle class="text-xl">{{ item.title }}</CardTitle>
                </CardHeader>

                <CardContent class="flex items-center justify-between">
                    <DagCountToAnimator :end-val="item.value" :start-val="1" class="text-xl" />
                    <DagIcon :icon="item.icon" class="size-8 flex-shrink-0" />
                </CardContent>

                <CardFooter class="justify-between">
                    <span>{{ item.totalTitle }}</span>
                    <DagCountToAnimator :end-val="item.totalValue" :start-val="1" />
                </CardFooter>
            </Card>
        </template>
    </div>
</template>
