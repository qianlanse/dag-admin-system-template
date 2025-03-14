enum CacheType {
    ALWAYS = 'ALWAYS',
    NEVER = 'NEVER'
}

export interface FindUserInput {
    cache: CacheType
    id: string
}

export type FindUserOutput = {
    age: number
    id: string
    name: string
}

export type FindxAllUsersInput = {
    cache: CacheType
    ids: string[]
}

export class Cache {
    prop: string
}

export function findAllUsers() {
    return 'hello'
}
