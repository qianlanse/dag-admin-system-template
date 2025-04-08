<script setup lang="ts">
    import type { Recordable } from '@dag/types'

    import type { DagFormProps, DagFormSchema } from '@dag-core/form-ui'

    import { computed, reactive } from 'vue'
    import { useRouter } from 'vue-router'

    import { $t } from '@dag/locales'

    import { useDagForm } from '@dag-core/form-ui'
    import { DagButton } from '@dag-core/shadcn-ui'

    import Title from './auth-title.vue'

    interface Props {
        /** 表单验证 */
        formSchema: DagFormSchema[]
        /** 是否处于加载处理状态 */
        loading?: boolean
        /** 登录路径 */
        loginPath?: string
        /** 标题 */
        title?: string
        /** 描述 */
        subTitle?: string
        /** 按钮文本 */
        submitButtonText?: string
    }

    const props = withDefaults(defineProps<Props>(), {
        loading: false,
        loginPath: '/auth/login',
        submitButtonText: '',
        subTitle: '',
        title: ''
    })

    const emit = defineEmits<{
        submit: [Recordable<any>]
    }>()

    const router = useRouter()

    const [Form, formApi] = useDagForm(
        reactive({
            commonConfig: {
                hideLabel: true,
                hideRequiredMark: true
            },
            schema: computed(() => props.formSchema),
            showDefaultActions: false
        }) as DagFormProps
    )

    async function handleSubmit() {
        const { valid } = await formApi.validate()
        const values = await formApi.getValues()
        if (valid) {
            emit('submit', values)
        }
    }

    function handleLogin() {
        router.push(props.loginPath)
    }

    defineExpose({
        getFormApi: () => formApi
    })
</script>

<template>
    <div>
        <Title>
            <slot name="title"> {{ title || $t('authentication.welcomeBack') }} 📲 </slot>
            <template #desc>
                <span class="text-muted-foreground">
                    <slot name="subTitle">
                        {{ subTitle || $t('authentication.codeSubtitle') }}
                    </slot>
                </span>
            </template>
        </Title>

        <Form />

        <DagButton class="w-full" @click="handleSubmit">
            <slot name="submitButtonText">
                {{ submitButtonText || $t('common.login') }}
            </slot>
        </DagButton>

        <DagButton class="mt-4 w-full" variant="outline" @click="handleLogin">
            <slot name="submitButtonText">
                {{ submitButtonText || $t('common.back') }}
            </slot>
        </DagButton>
    </div>
</template>
