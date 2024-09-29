import { createApp } from 'vue'

import { initStores } from '@dag/stores'

import App from './app.vue'
import { setupI18n } from './locales'

export async function bootstrap(namespace: string) {
    const app = createApp(App)

    // 国际化i18n配置
    await setupI18n(app)

    // 初始化存储库
    await initStores(app, { namespace })

    app.mount('#app')
}
