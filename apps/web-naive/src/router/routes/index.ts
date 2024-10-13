import type { RouteRecordRaw } from 'vue-router'

import { coreRoutes } from './core'

/**
 * 路由列表，基本路由+静态路由
 */
const routes: RouteRecordRaw[] = [...coreRoutes]

export { routes }
