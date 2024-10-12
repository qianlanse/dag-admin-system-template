/**
 * 储存类型
 */
export type StorageType = 'localStorage' | 'sessionStorage'

/**
 * 储存值对象
 */
export interface StorageValue<T> {
    expiry?: number
    value: T
}

/**
 * 储存类
 */
export interface IStorageCache {
    clear(): void
    getItem<T>(key: string): null | T
    key(index: number): null | string
    length(): number
    removeItem(key: string): void
    setItem<T>(key: string, value: T, expiryInMinutes?: number): void
}
