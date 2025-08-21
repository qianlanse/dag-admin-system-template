<script setup lang="ts">
    import { Page, useDagModal } from '@dag/common-ui'

    import { NButton, NCard } from 'naive-ui'

    import { useDagForm } from '#/adapter/form'
    import { getAllMenusApi } from '#/api'

    import modalDemo from './modal.vue'

    const [Form, formApi] = useDagForm({
        commonConfig: {
            componentProps: {
                class: 'w-full'
            },
            labelWidth: 120
        },
        layout: 'horizontal',
        wrapperClass: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
        handleSubmit: (values) => {
            // eslint-disable-next-line no-console
            console.log(`表单数据：${JSON.stringify(values)}`)
        },
        schema: [
            {
                component: 'ApiSelect',
                componentProps: {
                    afterFetch: (data: { name: string; path: string }[]) => {
                        return data.map((item: any) => ({
                            label: item.name,
                            value: item.path
                        }))
                    },
                    // 菜单接口
                    api: getAllMenusApi
                },
                fieldName: 'api',
                label: 'ApiSelect',
                rules: 'required'
            },
            {
                component: 'ApiTreeSelect',
                // 对应组件的参数
                componentProps: {
                    // 菜单接口
                    api: getAllMenusApi,
                    childrenField: 'children',
                    // 菜单接口转options格式
                    labelField: 'name',
                    valueField: 'path'
                },
                fieldName: 'apiTree',
                label: 'ApiTreeSelect',
                rules: 'required'
            },
            {
                component: 'Input',
                fieldName: 'string',
                label: 'String',
                rules: 'required'
            },
            {
                component: 'InputNumber',
                fieldName: 'number',
                label: 'Number',
                rules: 'required'
            },
            {
                component: 'RadioGroup',
                fieldName: 'radio',
                label: 'Radio',
                componentProps: {
                    options: [
                        { value: 'A', label: 'A' },
                        { value: 'B', label: 'B' },
                        { value: 'C', label: 'C' },
                        { value: 'D', label: 'D' },
                        { value: 'E', label: 'E' }
                    ]
                },
                rules: 'selectRequired'
            },
            {
                component: 'RadioGroup',
                fieldName: 'radioButton',
                label: 'RadioButton',
                componentProps: {
                    isButton: true,
                    class: 'flex flex-wrap',
                    options: [
                        { value: 'A', label: '选项A' },
                        { value: 'B', label: '选项B' },
                        { value: 'C', label: '选项C' },
                        { value: 'D', label: '选项D' },
                        { value: 'E', label: '选项E' }
                    ]
                },
                rules: 'selectRequired'
            },
            {
                component: 'CheckboxGroup',
                fieldName: 'checkbox',
                label: 'Checkbox',
                componentProps: {
                    options: [
                        { value: 'A', label: '选项A' },
                        { value: 'B', label: '选项B' },
                        { value: 'C', label: '选项C' }
                    ]
                },
                rules: 'selectRequired'
            },
            {
                component: 'DatePicker',
                fieldName: 'date',
                label: 'Date',
                rules: 'required'
            },
            {
                component: 'Input',
                fieldName: 'textArea',
                label: 'TextArea',
                componentProps: {
                    type: 'textarea'
                },
                rules: 'required'
            }
        ]
    })

    const [Modal, modalApi] = useDagModal({
        connectedComponent: modalDemo
    })

    /** 设置默认值 */
    function setFormValues() {
        formApi.setValues({
            string: 'string',
            number: 123,
            radio: 'B',
            radioButton: 'C',
            textArea: 'abc textArea',
            checkbox: ['A', 'C'],
            date: Date.now()
        })
    }
</script>

<template>
    <Page title="表单演示" description="测试表单数据">
        <NCard title="基础表单">
            <template #header-extra>
                <NButton type="primary" @click="setFormValues">设置表单值</NButton>
                <NButton type="error" class="ml-2" @click="modalApi.open()">打开弹窗</NButton>
            </template>
            <Form />
        </NCard>
        <Modal />
    </Page>
</template>
