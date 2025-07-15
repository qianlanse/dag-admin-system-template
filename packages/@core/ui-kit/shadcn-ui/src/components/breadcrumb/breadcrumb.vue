<script setup lang="ts">
    import type { BreadcrumbProps } from './types'

    import {
        Breadcrumb,
        BreadcrumbItem,
        BreadcrumbLink,
        BreadcrumbList,
        BreadcrumbPage,
        BreadcrumbSeparator
    } from '../../ui'
    import { DagIcon } from '../icon'

    interface Props extends BreadcrumbProps {}

    defineOptions({ name: 'Breadcrumb' })

    withDefaults(defineProps<Props>(), {
        showIcon: false
    })

    const emit = defineEmits<{ select: [string] }>()

    function handleClick(path?: string) {
        if (path) {
            emit('select', path)
        }
    }
</script>

<template>
    <Breadcrumb>
        <BreadcrumbList>
            <TransitionGroup name="breadcrumb-transition">
                <template
                    v-for="(item, index) in breadcrumbs"
                    :key="`${item.path}-${item.title}-${index}`"
                >
                    <BreadcrumbItem>
                        <div v-if="item.items?.length ?? 0 > 0">
                            <span>1</span>
                        </div>
                        <BreadcrumbLink
                            v-else-if="index !== breadcrumbs.length - 1"
                            href="javascript:void 0"
                            @click.stop="handleClick(item.path)"
                        >
                            <div class="flex-center">
                                <DagIcon
                                    v-if="showIcon"
                                    :class="{ 'size-5': item.isHome }"
                                    :icon="item.icon"
                                    class="mr-1 size-4"
                                />
                                {{ item.title }}
                            </div>
                        </BreadcrumbLink>
                        <BreadcrumbPage v-else>
                            <div class="flex-center">
                                <DagIcon
                                    v-if="showIcon"
                                    :class="{ 'size-5': item.isHome }"
                                    :icon="item.icon"
                                    class="mr-1 size-4"
                                />
                                {{ item.title }}
                            </div>
                        </BreadcrumbPage>
                        <BreadcrumbSeparator
                            v-if="index < breadcrumbs.length - 1 && !item.isHome"
                        />
                    </BreadcrumbItem>
                </template>
            </TransitionGroup>
        </BreadcrumbList>
    </Breadcrumb>
</template>
