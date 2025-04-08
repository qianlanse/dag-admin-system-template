<script setup lang="ts">
    import type { PinInputProps } from './types'

    import { computed, onBeforeUnmount, ref, useId, watch } from 'vue'

    import { PinInput, PinInputGroup, PinInputInput } from '../../ui'
    import { DagButton } from '../button'

    defineOptions({
        inheritAttrs: false
    })

    const {
        codeLength = 6,
        createText = async () => {},
        disabled = false,
        handleSendCode = async () => {},
        loading = false,
        maxTime = 60
    } = defineProps<PinInputProps>()
    const emit = defineEmits<{
        complete: []
        sendError: [error: any]
    }>()

    const modelValue = defineModel<string>()

    const inputValue = ref<string[]>([])
    const countdown = ref(0)
    const timer = ref<ReturnType<typeof setTimeout>>()

    const id = useId()

    const btnText = computed(() => {
        const countdownValue = countdown.value
        return createText?.(countdownValue)
    })
    const btnLoading = computed(() => {
        return loading || countdown.value > 0
    })

    watch(
        () => modelValue.value,
        () => {
            inputValue.value = modelValue.value?.split('') ?? []
        }
    )

    watch(inputValue, (val) => {
        modelValue.value = val.join('')
    })

    onBeforeUnmount(() => {
        countdown.value = 0
        clearTimeout(timer.value)
    })

    // 完成
    function handleComplete(e: string[]) {
        modelValue.value = e.join('')
        emit('complete')
    }

    // 发送验证码
    async function handleSend(evt: Event) {
        try {
            evt?.preventDefault()
            await handleSendCode()
            countdown.value = maxTime
            handleStartCountdown()
        } catch (error) {
            emit('sendError', error)
        }
    }

    // 倒计时
    function handleStartCountdown() {
        if (countdown.value > 0) {
            timer.value = setTimeout(() => {
                countdown.value--
                handleStartCountdown()
            }, 1000)
        }
    }
</script>

<template>
    <PinInput
        :id="id"
        v-model="inputValue"
        class="flex w-full justify-between"
        opt
        placeholder="○"
        type="number"
        @complete="handleComplete"
    >
        <div class="relative flex w-full">
            <PinInputGroup class="mr-2">
                <PinInputInput v-for="(item, index) in codeLength" :key="item" :index="index" />
            </PinInputGroup>

            <DagButton
                :disabled="disabled"
                :loading="btnLoading"
                class="flex-grow"
                size="lg"
                variant="outline"
                @click="handleSend"
            >
                {{ btnText }}
            </DagButton>
        </div>
    </PinInput>
</template>
