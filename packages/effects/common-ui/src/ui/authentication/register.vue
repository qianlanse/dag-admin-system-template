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
        /** 验证规则 */
        formSchema: DagFormSchema[]
        /** 是否处于加载状态 */
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
        name: 'RegisterForm'
    })

    const props = withDefaults(defineProps<Props>(), {
        formSchema: () => [],
        loading: false,
        loginPath: '/auth/login',
        submitButtonText: '',
        subTitle: '',
        title: ''
    })
    const emit = defineEmits<{
        submit: [Recordable<any>]
    }>()

    defineExpose({
        getFormApi: () => formApi
    })

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

    // 注册
    async function handleSubmit() {
        const { valid } = await formApi.validate()
        const values = await formApi.getValues()
        if (valid) {
            emit('submit', values as { password: string; username: string })
        }
    }

    // 登录
    function goToLogin() {
        router.push(props.loginPath)
    }
</script>

<template>
    <div>
        <Title>
            <slot name="title"> {{ title || $t('authentication.createAnAccount') }} 🚀 </slot>
            <template #desc>
                <slot name="subTitle">
                    {{ subTitle || $t('authentication.signUpSubtitle') }}
                </slot>
            </template>
        </Title>

        <Form />

        <DagButton
            :class="{
                'cursor-wait': loading
            }"
            :loading="loading"
            aria-label="register"
            class="mt-2 w-full"
            @click="handleSubmit"
        >
            <slot name="submitButtonText">
                {{ submitButtonText || $t('authentication.signUp') }}
            </slot>
        </DagButton>
        <div class="mt-4 text-center text-sm">
            {{ $t('authentication.alreadyHaveAccount') }}
            <span class="dag-link text-sm font-normal" @click="goToLogin">
                {{ $t('authentication.goToLogin') }}
            </span>
        </div>
    </div>
</template>
