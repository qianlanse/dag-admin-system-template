import type { RouteRecordRaw } from 'vue-router'

import { $t } from '@dag/locales'

const routes: RouteRecordRaw[] = [
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
