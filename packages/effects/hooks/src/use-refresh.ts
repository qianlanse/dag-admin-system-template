import { useRouter } from 'vue-router'

import { useTabbarStore } from '@dag/stores'

export function useRefresh() {
    const router = useRouter()
    const tabbarStore = useTabbarStore()

    async function refresh() {
        await tabbarStore.refresh(router)
    }

    return {
        refresh
    }
}
