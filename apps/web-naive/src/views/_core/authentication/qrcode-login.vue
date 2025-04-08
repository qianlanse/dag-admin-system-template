<script setup lang="ts">
    import { AuthenticationQrCodeLogin } from '@dag/common-ui'
    import { LOGIN_PATH } from '@dag/constants'

    defineOptions({
        name: 'QrCodeLogin'
    })
</script>

<template>
    <AuthenticationQrCodeLogin :login-path="LOGIN_PATH" />
</template>
