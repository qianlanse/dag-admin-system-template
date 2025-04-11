import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'

import { createRouterGuard } from './guard'
import { routes } from './routes'

/**
 * 创建vue-router实例
 */
const router = createRouter({
    history:
        import.meta.env.VITE_ROUTER_HISTORY === 'hash'
            ? createWebHashHistory(import.meta.env.VITE_BASE)
            : createWebHistory(import.meta.env.VITE_BASE),
    // 初始路由列表
    routes,
    scrollBehavior: (to, _from, savedPosition) => {
        if (savedPosition) {
            return savedPosition
        }
        return to.hash ? { behavior: 'smooth', el: to.hash } : { left: 0, top: 0 }
    }
})

/** 创建路由守卫 */
createRouterGuard(router)

export { router }
