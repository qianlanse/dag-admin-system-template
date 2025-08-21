<script setup lang="ts">
    import type { DataTableColumns, PaginationProps } from 'naive-ui'

    import { h, reactive, ref } from 'vue'

    import { Page } from '@dag/common-ui'

    import { NDataTable, NInput } from 'naive-ui'

    interface RowData {
        key: number
        name: string
        age: number
        address: string
    }

    const data = ref<RowData[]>(
        Array.from({ length: 100 })
            .fill({})
            .map((_, i) => ({
                key: i,
                name: `John Brown ${i}`,
                age: Math.round(Math.random() * 40),
                address: `New York No. ${i} Lake Park`
            }))
    )

    const columns = (): DataTableColumns<RowData> => [
        {
            type: 'selection'
        },
        {
            title: 'Name',
            key: 'name',
            render(row, index) {
                return h(NInput, {
                    value: row.name,
                    onUpdateValue(v) {
                        ;(data.value[index] as RowData).name = v
                    }
                })
            }
        },
        {
            title: 'Age',
            key: 'age'
        },
        {
            title: 'Address',
            key: 'address'
        }
    ]

    const pagination = reactive<PaginationProps>({
        pageSize: 10
    })
</script>

<template>
    <Page title="NDataTable" description="表格用于展示数据">
        <NDataTable :columns="columns()" :data="data" striped :pagination="pagination" />
    </Page>
</template>
