<script setup lang="ts">
    interface Props {
        /** 公司名称 */
        companyName?: string
        /** 公司链接地址 */
        companySiteLink?: string
        /** 日期 */
        date?: string
        /** 备案IP值 */
        icp?: string
        /** IP链接地址 */
        icpLink?: string
    }

    defineOptions({
        name: 'Copyright'
    })

    withDefaults(defineProps<Props>(), {
        companyName: 'Dag Admin',
        companySiteLink: '',
        date: '2025',
        icp: '',
        icpLink: ''
    })
</script>

<template>
    <div class="text-md flex-center">
        <a
            v-if="icp"
            :href="icpLink || 'javascript:void(0)'"
            class="hover:text-primart-hover mx-1"
            target="_blank"
        >
            {{ icp }}
        </a>

        Copyright © {{ date }}

        <a
            v-if="companyName"
            :href="companySiteLink || 'javascript:void(0)'"
            class="hover:text-primary-hover mx-1"
            target="_blank"
        >
            {{ companyName }}
        </a>
    </div>
</template>
