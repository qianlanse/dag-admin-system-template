import type { RouteRecordRaw } from 'vue-router'

import { coreRoutes, fallbackNotFoundRoute } from './core'

/**
 * 路由列表，基本路由+静态路由
 */
const routes: RouteRecordRaw[] = [...coreRoutes, fallbackNotFoundRoute]

export { routes }
