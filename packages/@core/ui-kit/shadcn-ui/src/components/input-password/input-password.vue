<script setup lang="ts">
    import { ref, useSlots } from 'vue'

    import { cn } from '@dag-core/shared/utils'

    import { Eye, EyeOff } from 'lucide-vue-next'

    import { Input } from '../../ui'
    import PasswordStrength from './password-strength.vue'

    const props = defineProps<{
        class?: any
        passwordStrength?: boolean
    }>()

    const modelValue = defineModel<string>()
    const slots = useSlots()

    const show = ref(false)
</script>

<template>
    <div class="relative w-full">
        <Input
            v-bind="$attrs"
            v-model="modelValue"
            :class="cn(props.class)"
            :type="show ? 'text' : 'password'"
        />
        <template v-if="passwordStrength">
            <PasswordStrength :password="modelValue" />
            <p v-if="slots.strengthText" class="text-muted-foreground mt-1.5 text-sm">
                <slot name="strengthText"></slot>
            </p>
        </template>
        <div
            :class="{
                'top-3': !!passwordStrength,
                'top-1/2 -translate-y-1/2 items-center': !passwordStrength
            }"
            class="text-foreground/60 hover:text-foreground absolute inset-y-0 right-0 flex cursor-pointer pr-3 text-lg leading-5"
            @click="show = !show"
        >
            <Eye v-if="show" class="size-4" />
            <EyeOff v-else class="size-4" />
        </div>
    </div>
</template>
