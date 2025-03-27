<script setup lang="ts">
    import type { DagFormSchema } from '@dag/common-ui'
    import type { BasicOption } from '@dag/types'

    import { computed, markRaw, ref } from 'vue'

    import { AuthenticationLogin, SliderCaptcha, z } from '@dag/common-ui'
    import { $t } from '@dag/locales'

    const loading = ref(false)

    const MOCK_USER_OPTIONS: BasicOption[] = [
        {
            label: 'Super',
            value: 'dag'
        },
        {
            label: 'Admin',
            value: 'admin'
        },
        {
            label: 'User',
            value: 'jack'
        }
    ]

    const formSchema = computed((): DagFormSchema[] => {
        return [
            {
                component: 'DagSelect',
                componentProps: {
                    options: MOCK_USER_OPTIONS,
                    placeholder: $t('authentication.selectAccount')
                },
                fieldName: 'selectAccount',
                label: $t('authentication.selectAccount'),
                rules: z
                    .string()
                    .min(1, { message: $t('authentication.selectAccount') })
                    .optional()
                    .default('dag')
            },
            {
                component: 'DagInput',
                componentProps: {
                    placeholder: $t('authentication.usernameTip')
                },
                dependencies: {
                    trigger(values, form) {
                        if (values.selectAccount) {
                            const findUser = MOCK_USER_OPTIONS.find(
                                (item) => item.value === values.selectAccount
                            )
                            if (findUser) {
                                form.setValues({
                                    password: '123456',
                                    username: findUser.value
                                })
                            }
                        }
                    },
                    triggerFields: ['selectAccount']
                },
                fieldName: 'username',
                label: $t('authentication.username'),
                rules: z.string().min(1, { message: $t('authentication.usernameTip') })
            },
            {
                component: 'DagInputPassword',
                componentProps: {
                    placeholder: $t('authentication.password')
                },
                fieldName: 'password',
                rules: z.string().min(1, { message: $t('authentication.passwordTip') })
            },
            {
                component: markRaw(SliderCaptcha),
                fieldName: 'captcha',
                rules: z.boolean().refine((value) => value, {
                    message: $t('authentication.verifyRequiredTip')
                })
            }
        ]
    })

    // 提交
    function handleSubmit(values: Record<string, any>) {
        // eslint-disable-next-line no-console
        console.log('submiting...', values)
    }
</script>

<template>
    <AuthenticationLogin :form-schema="formSchema" :loading="loading" @submit="handleSubmit" />
</template>
