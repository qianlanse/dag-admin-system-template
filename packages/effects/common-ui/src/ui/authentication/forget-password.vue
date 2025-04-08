<script setup lang="ts">
    import type { DagFormProps, DagFormSchema } from '@dag-core/form-ui'

    import { computed, reactive } from 'vue'
    import { useRouter } from 'vue-router'

    import { $t } from '@dag/locales'

    import { useDagForm } from '@dag-core/form-ui'
    import { DagButton } from '@dag-core/shadcn-ui'

    import Title from './auth-title.vue'

    interface Props {
        /** 表单 */
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

    defineOptions({
        name: 'AuthenticationForgetPassword'
    })

    const props = withDefaults(defineProps<Props>(), {
        loading: false,
        loginPath: '/auth/login',
        submitButtonText: '',
        subTitle: '',
        title: ''
    })
    const emit = defineEmits<{
        submit: [Record<string, any>]
    }>()

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

    const router = useRouter()

    // 返回登录
    function handleLogin() {
        router.push(props.loginPath)
    }

    // 提交表单
    async function handleSubmit() {
        const { valid } = await formApi.validate()
        const values = await formApi.getValues()
        if (valid) {
            emit('submit', values)
        }
    }

    defineExpose({
        getFormApi: () => formApi
    })
</script>

<template>
    <div>
        <Title>
            <slot name="title"> {{ title || $t('authentication.forgetPassword') }} 🤦🏻‍♂️ </slot>
            <template #desc>
                <slot name="subTitle">
                    {{ subTitle || $t('authentication.forgetPasswordSubtitle') }}
                </slot>
            </template>
        </Title>

        <Form />

        <div>
            <DagButton
                class="mt-2 w-full"
                aria-label="submit"
                :class="{ 'cursor-wait': loading }"
                @click="handleSubmit"
            >
                <slot name="submitButtonText">
                    {{ submitButtonText || $t('authentication.sendResetLink') }}
                </slot>
            </DagButton>
            <DagButton class="mt-4 w-full" variant="outline" @click="handleLogin">
                {{ $t('common.back') }}
            </DagButton>
        </div>
    </div>
</template>
