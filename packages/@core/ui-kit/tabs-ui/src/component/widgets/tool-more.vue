<script setup lang="ts">
    import type { DropdownMenuProps } from '@dag-core/shadcn-ui'

    import { ChevronDown } from '@dag-core/icons'
    import { DagDropdownMenu } from '@dag-core/shadcn-ui'

    defineProps<DropdownMenuProps>()
</script>

<template>
    <DagDropdownMenu :menus="menus" :modal="false">
        <div
            class="flex-center hover:bg-muted hover:text-foreground text-muted-foreground border-border h-full cursor-pointer border-l px-2 text-lg font-semibold"
        >
            <ChevronDown class="size-4" />
        </div>
    </DagDropdownMenu>
</template>
