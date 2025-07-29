import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

import { preferences } from '@dag/preferences'

export function useContentSpinner() {
    const router = useRouter()
    const minShowTime = 500

    const spinning = ref(false)
    const startTime = ref(0)

    const enableLoading = computed(() => preferences.transition.loading)

    router.beforeEach((to) => {
        if (to.meta.loaded || !enableLoading.value || to.meta.iframeSrc) {
            return true
        }
        startTime.value = performance.now()
        spinning.value = true
        return true
    })

    router.afterEach((to) => {
        if (to.meta.loaded || !enableLoading.value || to.meta.iframeSrc) {
            return true
        }

        const processTime = performance.now() - startTime.value
        if (processTime < minShowTime) {
            setTimeout(() => {
                spinning.value = false
            }, minShowTime - processTime)
        } else {
            spinning.value = false
        }

        return true
    })

    return {
        spinning
    }
}
