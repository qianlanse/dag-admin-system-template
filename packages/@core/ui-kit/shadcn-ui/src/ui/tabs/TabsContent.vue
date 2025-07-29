<script setup lang="ts">
    import type { TabsContentProps } from 'radix-vue'

    import { computed } from 'vue'

    import { cn } from '@dag-core/shared/utils'

    import { TabsContent } from 'radix-vue'

    const props = defineProps<TabsContentProps & { class?: any }>()

    const delegatedProps = computed(() => {
        const { class: _, ...delegated } = props
        return delegated
    })
</script>

<template>
    <TabsContent
        v-bind="delegatedProps"
        :class="
            cn(
                'ring-offset-background focus-visible:ring-ring mt-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
                props.class
            )
        "
    >
        <slot></slot>
    </TabsContent>
</template>
