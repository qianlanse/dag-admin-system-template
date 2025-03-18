import type { RouteRecordRaw } from 'vue-router'

import { DEFAULT_HOME_PATH, LOGIN_PATH } from '@dag/constants'

import { AuthPageLayout, BasicLayout } from '#/layouts'
import { $t } from '#/locales'
import Login from '#/views/_core/authentication/login.vue'

const coreRoutes: RouteRecordRaw[] = [
    {
        component: BasicLayout,
        meta: {
            hideInBreadcrumb: true,
            title: 'Root'
        },
        name: 'Root',
        path: '/',
        redirect: DEFAULT_HOME_PATH,
        children: []
    },
    {
        component: AuthPageLayout,
        meta: {
            title: 'Authentication'
        },
        name: 'Authentication',
        path: '/auth',
        redirect: LOGIN_PATH,
        children: [
            {
                name: 'Login',
                path: 'login',
                component: Login,
                meta: {
                    title: $t('page.auth.login')
                }
            }
        ]
    }
]

export { coreRoutes }
