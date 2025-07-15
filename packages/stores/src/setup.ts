import type { Pinia } from 'pinia'

import type { App } from 'vue'

import { createPinia } from 'pinia'
import SecureLS from 'secure-ls'

let pinia: Pinia

// 应用名将被用于持久化的前缀(为了防止多个app缓存冲突,可在这里配置应用名,应用名将被用于持久化的前缀)
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

    const ls = new SecureLS({
        encodingType: 'aes',
        encryptionSecret: import.meta.env.VITE_APP_STORE_SECURE_KEY,
        isCompression: true,
        // @ts-ignore 没有类型定义
        metaKey: `${namespace}-secure-meta`
    })

    // 持久化储存类似Token等值
    pinia.use(
        createPersistedState({
            key: (storeKey) => `${namespace}-${storeKey}`,
            storage: import.meta.env.DEV
                ? localStorage
                : {
                      getItem(key) {
                          return ls.get(key)
                      },
                      setItem(key, value) {
                          ls.set(key, value)
                      }
                  }
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
