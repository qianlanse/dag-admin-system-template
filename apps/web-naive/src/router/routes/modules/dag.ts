import type { RouteRecordRaw } from 'vue-router'

import { DAG_DOC_URL, DAG_GITHUB_URL, DAG_LOGO_URL } from '@dag/constants'
import { $t } from '@dag/locales'

import { IFrameView } from '#/layouts'

const routes: RouteRecordRaw[] = [
    {
        meta: {
            badgeType: 'dot',
            icon: DAG_LOGO_URL,
            order: 9888,
            title: $t('demos.dag.title')
        },
        name: 'DagProject',
        path: '/dag-admin',
        children: [
            {
                name: 'DagDocument',
                path: '/dag-admin/document',
                component: IFrameView,
                meta: {
                    icon: 'lucide:book-open-text',
                    link: DAG_DOC_URL,
                    title: $t('demos.dag.document')
                }
            },
            {
                name: 'DagGithub',
                path: '/dag-admin/github',
                component: IFrameView,
                meta: {
                    icon: 'mdi:github',
                    link: DAG_GITHUB_URL,
                    title: 'Github'
                }
            }
        ]
    },
    {
        name: 'DagAbout',
        path: '/dag-admin/about',
        component: () => import('#/views/_core/about/index.vue'),
        meta: {
            icon: 'lucide:copyright',
            title: $t('demos.dag.about'),
            order: 9999
        }
    }
]

export default routes
