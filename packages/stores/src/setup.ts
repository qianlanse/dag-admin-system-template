import type { Pinia } from 'pinia'

import type { App } from 'vue'

import { createPinia } from 'pinia'

let pinia: Pinia

// 应用名将被用于持久化的前缀
export interface InitStoreOptions {
    namespace: string
}

/**
 * 初始化存储库
 * @param app Vue App
 * @param options InitStoreOptions
 * @returns Pinia
 */
export async function initStores(app: App, options: InitStoreOptions) {
    const { namespace } = options
    const { createPersistedState } = await import('pinia-plugin-persistedstate')

    pinia = createPinia()
    pinia.use(
        createPersistedState({
            key: (storeKey) => `${namespace}-${storeKey}`,
            storage: localStorage
        })
    )

    app.use(pinia)
    return pinia
}

/**
 * 重置储存库
 */
export function resetAllStores() {
    if (!pinia) {
        console.error('Pinia is not installed')
        return
    }

    const allStores = (pinia as any)._s

    for (const [_key, store] of allStores) {
        store.$reset()
    }
}
