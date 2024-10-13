import type { RouteRecordRaw } from 'vue-router'

import { DEFAULT_HOME_PATH } from '@dag/constants'

import { AuthPageLayout } from '#/layouts'
import { $t } from '#/locales'
import Login from '#/views/_core/authentication/Login.vue'

const coreRoutes: RouteRecordRaw[] = [
    {
        meta: {
            title: 'Root'
        },
        name: 'Root',
        path: '/',
        redirect: DEFAULT_HOME_PATH
    },
    {
        component: AuthPageLayout,
        meta: {
            title: 'Authentication'
        },
        name: 'Authentication',
        path: '/auth',
        children: [
            {
                name: 'Login',
                path: 'login',
                component: Login,
                meta: {
                    title: $t('page.core.login')
                }
            }
        ]
    }
]

export { coreRoutes }
