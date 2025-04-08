import type { RouteRecordRaw } from 'vue-router'

import { DEFAULT_HOME_PATH, LOGIN_PATH } from '@dag/constants'

import { AuthPageLayout, BasicLayout } from '#/layouts'
import { $t } from '#/locales'
import Login from '#/views/_core/authentication/login.vue'

const fallbackNotFoundRoute: RouteRecordRaw = {
    component: () => import('#/views/_core/fallback/not-found.vue'),
    meta: {
        hideInBreadcrumb: true,
        hideInMenu: true,
        hideInTab: true,
        title: '404'
    },
    name: 'FallbackNotFound',
    path: '/:path(.*)*'
}

/** 基本路由 */
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
            },
            {
                name: 'Register',
                path: 'register',
                component: () => import('#/views/_core/authentication/register.vue'),
                meta: {
                    title: $t('page.auth.register')
                }
            },
            {
                name: 'CodeLogin',
                path: 'code-login',
                component: () => import('#/views/_core/authentication/code-login.vue'),
                meta: {
                    title: $t('page.auth.codeLogin')
                }
            },
            {
                name: 'QrCodeLogin',
                path: 'qrcode-login',
                component: () => import('#/views/_core/authentication/qrcode-login.vue'),
                meta: {
                    title: $t('page.auth.qrcodeLogin')
                }
            },
            {
                name: 'ForgetPassword',
                path: 'forget-password',
                component: () => import('#/views/_core/authentication/forget-password.vue'),
                meta: {
                    title: $t('page.auth.forgetPassword')
                }
            }
        ]
    }
]

export { coreRoutes, fallbackNotFoundRoute }
