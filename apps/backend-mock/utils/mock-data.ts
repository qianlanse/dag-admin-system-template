export interface UserInfo {
    id: number
    password: string
    realName: string
    roles: string[]
    username: string
    homePath?: string
}

export const MOCK_USERS: UserInfo[] = [
    {
        id: 0,
        password: '123456',
        realName: 'Dag',
        roles: ['super'],
        username: 'dag'
    },
    {
        id: 1,
        password: '123456',
        realName: 'Admin',
        roles: ['admin'],
        username: 'admin',
        homePath: '/workspace'
    },
    {
        id: 2,
        password: '123456',
        realName: 'Anyu',
        roles: ['user'],
        username: 'anyu',
        homePath: '/analytics'
    }
]

export const MOCK_CODES = [
    // super
    {
        codes: ['AC_100100', 'AC_100110', 'AC_100120', 'AC_100010'],
        username: 'dag'
    },
    {
        // admin
        codes: ['AC_100010', 'AC_100020', 'AC_100030'],
        username: 'admin'
    },
    {
        // user
        codes: ['AC_1000001', 'AC_1000002'],
        username: 'anyu'
    }
]

const dashboardMenus = [
    {
        meta: {
            order: -1,
            title: 'page.dashboard.title'
        },
        name: 'Dashboard',
        path: '/dashboard',
        redirect: '/analytics',
        children: [
            {
                name: 'Analytics',
                path: '/analytics',
                component: '/dashboard/analytics/index',
                meta: {
                    affixTab: true,
                    title: 'page.dashboard.analytics'
                }
            },
            {
                name: 'Workspace',
                path: '/workspace',
                component: '/dashboard/workspace/index',
                meta: {
                    affixTab: true,
                    title: 'page.dashboard.workspace'
                }
            }
        ]
    }
]

const createDemosMenus = (role: 'admin' | 'super' | 'user') => {
    const roleWithMenus = {
        admin: {
            name: 'AccessAdminVisibleDemo',
            path: '/demos/access/admin-visible',
            component: '/demos/access/admin-visible',
            meta: {
                icon: 'mdi:button-cursor',
                title: 'demos.access.adminVisible'
            }
        },
        super: {
            name: 'AccessSuperVisibleDemo',
            path: '/demos/access/super-visible',
            component: '/demos/access/super-visible',
            meta: {
                icon: 'mdi:button-cursor',
                title: 'demos.access.superVisible'
            }
        },
        user: {
            name: 'AccessUserVisibleDemo',
            path: '/demos/access/user-visible',
            component: '/demos/access/user-visible',
            meta: {
                icon: 'mdi:button-cursor',
                title: 'demos.access.userVisible'
            }
        }
    }

    return [
        {
            name: 'Demos',
            path: '/demos',
            redirect: '/demos/access',
            meta: {
                icon: 'ic:baseline-view-in-ar',
                keepAlive: true,
                order: 1000,
                title: 'demos.title'
            },
            children: [
                {
                    name: 'AccessDemos',
                    path: '/demosaccess',
                    meta: {
                        icon: 'mdi:cloud-key-outline',
                        title: 'demos.access.backendPermissions'
                    },
                    redirect: '/demos/access/page-control',
                    children: [
                        {
                            name: 'AccessPageControlDemo',
                            path: '/demos/access/page-control',
                            component: '/demos/access/index',
                            meta: {
                                icon: 'mdi:page-previous-outline',
                                title: 'demos.access.pageAccess'
                            }
                        },
                        {
                            name: 'AccessButonControlDemo',
                            path: '/demos/access/button-control',
                            component: '/demos/access/button-control',
                            meta: {
                                icon: 'mdi:button-cursor',
                                title: 'demos.access.buttonControl'
                            }
                        },
                        {
                            name: 'AccessMenuVisible403Demo',
                            path: '/demos/access/menu-visible-403',
                            component: '/demos/access/menu-visible-403',
                            meta: {
                                icon: 'mdi:button-cursor',
                                title: 'demos.access.menuVisible403',
                                authority: ['no-body'],
                                menuVisibleWithForbidden: true
                            }
                        },
                        roleWithMenus[role]
                    ]
                }
            ]
        }
    ]
}

export const MOCK_MENUS = [
    {
        menus: [...dashboardMenus, ...createDemosMenus('super')],
        username: 'dag'
    },
    {
        menus: [...dashboardMenus, ...createDemosMenus('admin')],
        username: 'admin'
    },
    {
        menus: [...dashboardMenus, ...createDemosMenus('user')],
        username: 'anyu'
    }
]
