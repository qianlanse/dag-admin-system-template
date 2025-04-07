<script setup lang="ts">
    import type { DagFormSchema } from '@dag/common-ui'

    import { computed, h, ref } from 'vue'

    import { AuthenticationRegister, z } from '@dag/common-ui'
    import { $t } from '@dag/locales'

    defineOptions({
        name: 'Register'
    })

    const loading = ref(false)
    const formSchema = computed((): DagFormSchema[] => {
        return [
            {
                component: 'DagInput',
                componentProps: {
                    placeholder: $t('authentication.usernameTip')
                },
                fieldName: 'username',
                label: $t('authentication.username'),
                rules: z.string().min(1, { message: $t('authentication.usernameTip') })
            },
            {
                component: 'DagInputPassword',
                componentProps: {
                    passwordStrength: true,
                    placeholder: $t('authentication.password')
                },
                fieldName: 'password',
                label: $t('authentication.password'),
                renderComponentContent() {
                    return {
                        strengthText: () => $t('authentication.passwordStrength')
                    }
                },
                rules: z.string().min(1, { message: $t('authentication.passwordTip') })
            },
            {
                component: 'DagInputPassword',
                componentProps: {
                    placeholder: $t('authentication.confirmPassword')
                },
                fieldName: 'confirmPassword',
                label: $t('authentication.confirmPassword'),
                dependencies: {
                    rules(values) {
                        const { password } = values
                        return z
                            .string({ required_error: $t('authentication.passwordTip') })
                            .min(1, { message: $t('authentication.passwordTip') })
                            .refine((value) => value === password, {
                                message: $t('authentication.confirmPasswordTip')
                            })
                    },
                    triggerFields: ['password']
                }
            },
            {
                component: 'DagCheckbox',
                fieldName: 'agreePolicy',
                renderComponentContent: () => ({
                    default: () =>
                        h('span', [
                            $t('authentication.agree'),
                            h(
                                'a',
                                {
                                    class: 'dag-link ml-1',
                                    href: ''
                                },
                                `${$t('authentication.privacyPolicy')} & ${$t('authentication.terms')}`
                            )
                        ])
                }),
                rules: z.boolean().refine((value) => !!value, {
                    message: $t('authentication.agreeTip')
                })
            }
        ]
    })

    // 注册
    function handleSubmit(values: Record<string, any>) {
        // eslint-disable-next-line no-console
        console.log('values:', values)
    }
</script>

<template>
    <AuthenticationRegister :form-schema="formSchema" :loading="loading" @submit="handleSubmit" />
</template>
