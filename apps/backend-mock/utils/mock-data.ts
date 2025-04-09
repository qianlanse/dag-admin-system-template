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
