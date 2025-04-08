<script setup lang="ts">
    import type { DagFormSchema } from '@dag/common-ui'
    import type { Recordable } from '@dag/types'

    import { computed, ref } from 'vue'

    import { AuthenticationForgetPassword, z } from '@dag/common-ui'
    import { $t } from '@dag/locales'

    defineOptions({
        name: 'ForgetPassword'
    })

    const loading = ref(false)

    const formSchema = computed((): DagFormSchema[] => {
        return [
            {
                component: 'DagInput',
                componentProps: {
                    placeholder: 'admin@dageek.cn'
                },
                fieldName: 'email',
                label: $t('authentication.email'),
                rules: z
                    .string()
                    .min(1, { message: $t('authentication.emailTip') })
                    .email($t('authentication.emailValidErrorTip'))
            }
        ]
    })

    // 提交表单
    function handleSubmit(value: Recordable<any>) {
        // eslint-disable-next-line no-console
        console.log('reset email:', value)
    }
</script>

<template>
    <AuthenticationForgetPassword
        :form-schema="formSchema"
        :loading="loading"
        @submit="handleSubmit"
    />
</template>
