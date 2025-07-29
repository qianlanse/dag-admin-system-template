<script setup lang="ts">
    import { DagSpinner } from '@dag-core/shadcn-ui'

    import { useContentSpinner } from './use-content-spinner'

    defineOptions({
        name: 'LayoutContentSpinner'
    })

    const { spinning } = useContentSpinner()
</script>

<template>
    <DagSpinner :spinning="spinning" />
</template>
