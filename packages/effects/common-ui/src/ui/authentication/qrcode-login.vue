<script setup lang="ts">
    import { useRouter } from 'vue-router'

    import { $t } from '@dag/locales'

    import { DagButton } from '@dag-core/shadcn-ui'

    import { useQRCode } from '@vueuse/integrations/useQRCode'

    import Title from './auth-title.vue'

    interface Props {
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
        /** 描述 */
        description?: string
    }

    defineOptions({
        name: 'AuthenticationQrCodeLogin'
    })

    const props = withDefaults(defineProps<Props>(), {
        description: '',
        loading: false,
        loginPath: '/auth/login',
        submitButtonText: '',
        subTitle: '',
        title: ''
    })

    const qrcode = useQRCode('https://baidu.com', {
        errorCorrectionLevel: 'H',
        margin: 4
    })
    const router = useRouter()

    // 登录
    function handleLogin() {
        router.push(props.loginPath)
    }
</script>

<template>
    <div>
        <Title>
            <slot name="title"> {{ title || $t('authentication.welcomeBack') }} 📱 </slot>
            <template #desc>
                <span class="text-muted-foreground">
                    <slot name="subTitle">
                        {{ subTitle || $t('authentication.qrcodeSubtitle') }}
                    </slot>
                </span>
            </template>
        </Title>

        <div class="flex-col-center mt-6">
            <img :src="qrcode" alt="qrcode" class="w-1/2" />
            <p class="text-muted-foreground mt-4 text-sm">
                {{ description || $t('authentication.qrcodePrompt') }}
            </p>
        </div>

        <DagButton class="mt-4 w-full" variant="outline" @click="handleLogin">
            {{ $t('common.back') }}
        </DagButton>
    </div>
</template>
