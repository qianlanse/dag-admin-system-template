<script setup lang="ts">
    import { computed } from 'vue'

    const props = withDefaults(defineProps<{ password?: string }>(), {
        password: ''
    })

    const strengthList: string[] = ['', '#e74242', '#ED6F6F', '#EFBD47', '#55D18780', '#55D187']

    const currentStrength = computed(() => {
        return checkPasswordStrength(props.password)
    })

    const currentColor = computed(() => {
        return strengthList[currentStrength.value]
    })

    function checkPasswordStrength(password: string) {
        let strength = 0

        // 检查长度
        if (password.length >= 8) strength++

        // 检查是否有小写字母
        if (/[a-z]/.test(password)) strength++

        // 检查大写字母
        if (/[A-Z]/.test(password)) strength++

        // 检查数字
        if (/\d/.test(password)) strength++

        // 检查特殊字符
        if (/[^\da-z]/i.test(password)) strength++

        return strength
    }
</script>

<template>
    <div class="relative mt-2 flex items-center justify-between">
        <template v-for="index in 5" :key="index">
            <div
                class="bg-heavy dark:bg-input-background relative mr-1 h-1.5 w-1/5 rounded-sm last:mr-0"
            >
                <span
                    class="absolute left-0 h-full w-0 rounded-sm transition-all duration-500"
                    :style="{
                        backgroundColor: currentColor,
                        width: currentStrength >= index ? '100%' : ''
                    }"
                ></span>
            </div>
        </template>
    </div>
</template>
