<script setup lang="ts">
    import { computed, ref } from 'vue'

    import { $t } from '@dag/locales'
    import { useUserStore } from '@dag/stores'

    const userStore = useUserStore()

    const roles = computed(() => userStore.userRoles)

    function setUserRoles() {
        userStore.setUserRoles(['admin', 'user'])
    }

    const count = ref(0)
</script>

<template>
    <div class="container" @click="setUserRoles">
        <span>Hello Vite Naive {{ count }} {{ roles.join() }} {{ $t('page.core.login') }}</span>
    </div>
</template>

<style scoped>
    .container {
        background-color: white;
    }
</style>
