import type { StorageType, StorageValue } from './types'

interface StorageManagerOptions {
    prefix?: string
    storageType?: StorageType
}
export class StorageManager {
    private prefix: string
    private storage: Storage

    constructor({ prefix = '', storageType = 'localStorage' }: StorageManagerOptions = {}) {
        this.prefix = prefix
        this.storage = storageType === 'localStorage' ? window.localStorage : window.sessionStorage
    }

    /**
     * 获取完整的储存库
     * @param key {string}
     */
    private getFullKey(key: string): string {
        return `${this.prefix}-${key}`
    }

    /**
     * 移除所有带前缀的储存项
     */
    public clear() {
        const keysToRemove: string[] = []
        for (let index = 0; index < this.storage.length; index++) {
            const key = this.storage.key(index)
            if (key && key.startsWith(this.prefix)) {
                keysToRemove.push(key)
            }
        }

        keysToRemove.forEach((key) => this.storage.removeItem(key))
    }

    /**
     * 移除所有过期的储存项
     */
    public clearExpiredItems() {
        for (let index = 0; index < this.storage.length; index++) {
            const key = this.storage.key(index)
            if (key && key.startsWith(this.prefix)) {
                const shortKey = key.replace(this.prefix, '')
                this.getItem(shortKey)
            }
        }
    }

    /**
     * 获取储存项
     * @param key 键
     * @param defaultValue 默认值
     * @returns 值，失败或过期返回默认值
     */
    public getItem<T>(key: string, defaultValue: null | T = null): null | T {
        const fullKey = this.getFullKey(key)
        const itemStr = this.storage.getItem(fullKey)

        if (!itemStr) {
            return defaultValue
        }

        try {
            const item: StorageValue<T> = JSON.parse(itemStr)
            if (item.expiry && Date.now() > item.expiry) {
                this.storage.removeItem(fullKey)
                return defaultValue
            }
            return item.value
        } catch (error) {
            console.error(`获取储存错误：${fullKey}:`, error)
            // 解析失败删除该项
            this.storage.removeItem(fullKey)
            return defaultValue
        }
    }

    /**
     * 移除储存项
     * @param key 键
     */
    public removeItem(key: string) {
        const fullKey = this.getFullKey(key)
        this.storage.removeItem(fullKey)
    }

    /**
     * 设置储存项
     * @param key 键
     * @param value 值
     * @param ttl 过期时间
     */
    public setItem<T>(key: string, value: T, ttl?: number) {
        const fullKey = this.getFullKey(key)
        const expiry = ttl ? Date.now() + ttl : undefined
        const item: StorageValue<T> = { expiry, value }

        try {
            this.storage.setItem(fullKey, JSON.stringify(item))
        } catch (error) {
            console.error(`设置储存错误：${fullKey}:`, error)
        }
    }
}
