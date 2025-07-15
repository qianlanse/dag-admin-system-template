import type { ComponentRecordType, GenerateMenuAndRoutesOptions } from '@dag/types'

import { generateAccessible } from '@dag/access'
import { preferences } from '@dag/preferences'

import { getAllMenusApi } from '#/api'
import { BasicLayout, IFrameView } from '#/layouts'

const forbiddenComponent = () => import('#/views/_core/fallback/forbidden.vue')

/** 生成权限路由集合 */
async function generateAccess(options: GenerateMenuAndRoutesOptions) {
    const pageMap: ComponentRecordType = import.meta.glob('../views/**/*.vue')

    const layoutMap: ComponentRecordType = {
        BasicLayout,
        IFrameView
    }

    return await generateAccessible(preferences.app.accessMode, {
        ...options,
        async fetchMenuListAsync() {
            // eslint-disable-next-line no-console
            console.log('菜单加载中..')
            return await getAllMenusApi()
        },
        // 可以指定没有权限跳转403页面
        forbiddenComponent,
        layoutMap,
        pageMap
    })
}

export { generateAccess }
