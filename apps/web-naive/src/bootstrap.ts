import { createApp, watchEffect } from 'vue'

import { preferences } from '@dag/preferences'
import { initStores } from '@dag/stores'
import '@dag/styles'

import { useTitle } from '@vueuse/core'

import App from './app.vue'
import { $t, setupI18n } from './locales'
import { router } from './router'

async function bootstrap(namespace: string) {
    // 初始化组件适配器
    // initComponentAdapter()

    const app = createApp(App)

    // 注册v-loading指令
    // registerLoadingDirective(app, {
    //     loading: 'loading',
    //     spinning: 'spinning'
    // })

    // 国际化i18n配置
    await setupI18n(app)

    // 初始化存储库
    await initStores(app, { namespace })

    // 配置路由及路由守卫
    app.use(router)

    // 动态更新标题
    watchEffect(() => {
        if (preferences.app.dynamicTitle) {
            const routeTitle = router.currentRoute.value.meta?.title
            const pageTitle = (routeTitle ? `${$t(routeTitle)} - ` : '') + preferences.app.name
            useTitle(pageTitle)
        }
    })

    app.mount('#app')
}

export { bootstrap }
