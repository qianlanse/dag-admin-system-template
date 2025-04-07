<!-- eslint-disable no-console -->
<script setup lang="ts">
    import type { Recordable } from '@dag/types'

    import type { DagFormProps, DagFormSchema } from '@dag-core/form-ui'

    import type { AuthencationProps } from './types'

    import { computed, onMounted, reactive, ref } from 'vue'
    import { useRouter } from 'vue-router'

    import { $t } from '@dag/locales'

    import { useDagForm } from '@dag-core/form-ui'
    import { DagButton, DagCheckbox } from '@dag-core/shadcn-ui'

    import AuthTitle from './auth-title.vue'
    import ThirdPartyLogin from './third-party-login.vue'

    interface Props extends AuthencationProps {
        formSchema: DagFormSchema[]
    }

    defineOptions({
        name: 'AuthenticationLogin'
    })

    const props = withDefaults(defineProps<Props>(), {
        codeLoginPath: '/auth/code-login',
        forgetPasswordPath: '/auth/forget-password',
        qrCodeLoginPath: '/auth/qrcode-login',
        registerPath: '/auth/register',
        loading: false,
        showCodeLogin: true,
        showForgetPassword: true,
        showQrcodeLogin: true,
        showRegister: true,
        showRememberMe: true,
        showThirdPartyLogin: true,
        formSchema: () => [],
        submitButtonText: '',
        subTitle: '',
        title: ''
    })
    const emits = defineEmits<{
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

    const REMEMBER_ME_KEY = `REMEMBER_ME_USERNAME_${location.hostname}`
    const localUsername = localStorage.getItem(REMEMBER_ME_KEY) || ''

    const rememberMe = ref(!!localUsername)

    onMounted(() => {
        if (localUsername) {
            formApi.setFieldValue('username', localUsername)
        }
    })

    defineExpose({
        getFormApi: () => formApi
    })

    // 登录
    async function handleSubmit() {
        const { valid } = await formApi.validate()
        const values = await formApi.getValues()

        if (valid) {
            localStorage.setItem(REMEMBER_ME_KEY, rememberMe.value ? values?.username : '')
            emits('submit', values)
        }
    }

    // 其它登录
    function handleGo(path: string) {
        router.push(path)
    }
</script>

<template>
    <div @keydown.enter.prevent="handleSubmit">
        <slot name="title">
            <AuthTitle>
                <slot name="title">
                    {{ title || `${$t('authentication.welcomeBack')} 👋🏻` }}
                </slot>
                <template #desc>
                    <span class="text-muted-foreground">
                        <slot name="subTitle">
                            {{ subTitle || $t('authentication.loginSubtitle') }}
                        </slot>
                    </span>
                </template>
            </AuthTitle>
        </slot>

        <Form />

        <div v-if="showRememberMe || showForgetPassword" class="mb-6 flex justify-between">
            <div class="flex-center">
                <DagCheckbox v-if="showRememberMe" v-model:checked="rememberMe" name="rememberMe">
                    {{ $t('authentication.rememberMe') }}
                </DagCheckbox>
            </div>

            <span v-if="showForgetPassword" class="dag-link text-sm font-normal">
                {{ $t('authentication.forgetPassword') }}
            </span>
        </div>

        <!-- 表单提交按钮 -->
        <DagButton
            :class="{ 'cursor-wait': loading }"
            :loading="loading"
            aria-label="login"
            class="w-full"
            @click="handleSubmit"
        >
            {{ submitButtonText || $t('common.login') }}
        </DagButton>

        <!-- 手机号或扫码登录 -->
        <div v-if="showCodeLogin || showQrcodeLogin" class="mb-2 mt-4 flex items-center">
            <DagButton
                v-if="showCodeLogin"
                class="w-1/2"
                variant="outline"
                @click="handleGo(codeLoginPath)"
            >
                {{ $t('authentication.mobileLogin') }}
            </DagButton>
            <DagButton
                v-if="showQrcodeLogin"
                class="ml-4 w-1/2"
                variant="outline"
                @click="handleGo(qrCodeLoginPath)"
            >
                {{ $t('authentication.qrcodeLogin') }}
            </DagButton>
        </div>

        <!-- 第三方登录 -->
        <slot name="third-party-login">
            <ThirdPartyLogin v-if="showThirdPartyLogin" />
        </slot>

        <!-- 注册 -->
        <slot name="to-register">
            <div v-if="showRegister" class="mt-3 items-center text-center text-sm">
                {{ $t('authentication.accountTip') }}
                <span class="dag-link text-sm font-normal" @click="handleGo(registerPath)">
                    {{ $t('authentication.createAccount') }}
                </span>
            </div>
        </slot>
    </div>
</template>
