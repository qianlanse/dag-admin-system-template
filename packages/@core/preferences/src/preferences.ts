import type { DeepPartial } from '@dag-core/typings'

import type { InitialOptions, Preferences } from './types'

import { markRaw, reactive, readonly } from 'vue'

import { StorageManager } from '@dag-core/shared/cache'
import { merge } from '@dag-core/shared/utils'

import { useDebounceFn } from '@vueuse/core'

import { defaultPreferences } from './config'
import { updateCSSVariables } from './update-css-variables'

const STORAGE_KEY = 'preferences'
const STORAGE_KEY_LOCALE = `${STORAGE_KEY}-locale`
const STORAGE_KEY_THEME = `${STORAGE_KEY}-theme`

class PreferenceManager {
    private cache: null | StorageManager = null
    private initialPreferences: Preferences = defaultPreferences
    private isInitialized: boolean = false
    private savePreferences: (preference: Preferences) => void
    private state: Preferences = reactive<Preferences>({
        ...this.loadPreferences()
    })

    constructor() {
        this.cache = new StorageManager()

        this.savePreferences = useDebounceFn(
            (preference: Preferences) => this._savePreferences(preference),
            150
        )
    }

    /** 清除缓存 */
    clearCache() {
        ;[STORAGE_KEY, STORAGE_KEY_LOCALE, STORAGE_KEY_THEME].forEach((key) => {
            this.cache?.removeItem(key)
        })
    }

    /** 获取初始化值 */
    public getInitialPreferences() {
        return this.initialPreferences
    }

    /**
     * 获取偏好设置state
     * @returns readonly state
     */
    public getPreferences() {
        return readonly(this.state)
    }

    /**
     * 初始化覆盖偏好设置
     * namespace 命名空间
     * overrides 要覆盖的偏好设置
     */
    public async initPreferences({ namespace, overrides }: InitialOptions) {
        if (this.isInitialized) {
            return
        }
        // 初始化储存管理
        this.cache = new StorageManager({ prefix: namespace })
        // 合并初始偏好设置
        this.initialPreferences = merge({}, overrides, defaultPreferences)

        // 加载并合并当前储存的偏好设置
        const mergedPreference = merge(
            {},
            this.loadCachedPreferences() || {},
            this.initialPreferences
        )

        // 更新偏好设置
        this.updatePreferences(mergedPreference)
        this.isInitialized = true
    }

    /**
     * 重置偏好设置
     */
    resetPreferences() {
        // 将状态重置为初始偏好设置
        Object.assign(this.state, this.initialPreferences)
        // 保存重置后的偏好设置
        this.savePreferences(this.state)
        // 从储存中移除偏好设置项
        ;[STORAGE_KEY, STORAGE_KEY_THEME, STORAGE_KEY_LOCALE].forEach((key) => {
            this.cache?.removeItem(key)
        })
        this.updatePreferences(this.state)
    }

    /**
     * 更新偏好设置
     * @param updates 要更新的偏好设置
     */
    public updatePreferences(updates: DeepPartial<Preferences>) {
        const mergedState = merge({}, updates, markRaw(this.state))

        Object.assign(this.state, mergedState)

        // 根据更新的键值执行相应的操作
        this.handleUpdates(updates)
        this.savePreferences(this.state)
    }

    /**
     * 保存偏好设置
     * @param {Preferences} preference 需要保存的偏好设置
     */
    private _savePreferences(preference: Preferences) {
        this.cache?.setItem(STORAGE_KEY, preference)
        this.cache?.setItem(STORAGE_KEY_LOCALE, preference.app.locale)
        this.cache?.setItem(STORAGE_KEY_THEME, preference.theme.mode)
    }

    /**
     * 处理更新的键值
     * @param {DeepPartial<Preferences>} updates 部分更新的偏好设置
     */
    private handleUpdates(updates: DeepPartial<Preferences>) {
        const themeUpdates = updates.theme || {}
        const appUpdates = updates.app || {}
        if (themeUpdates && Object.keys(themeUpdates).length > 0) {
            updateCSSVariables(this.state)
        }

        if (Reflect.has(appUpdates, 'colorGrayMode') || Reflect.has(appUpdates, 'colorWeakMode')) {
            this.updateColorMode(this.state)
        }
    }

    /**
     * 从缓存中获取偏好设置，若缓存中不存在则返回默认偏好设置
     */
    private loadCachedPreferences() {
        return this.cache?.getItem<Preferences>(STORAGE_KEY)
    }

    /**
     * 加载偏好设置
     * @returns {Preferences} 加载偏好设置
     */
    private loadPreferences(): Preferences {
        return this.loadCachedPreferences() || { ...defaultPreferences }
    }

    /**
     * 更新页面颜色模式(灰色、色弱)
     * @param preference
     */
    private updateColorMode(preference: Preferences) {
        if (preference.app) {
            const { colorGrayMode, colorWeakMode } = preference.app
            const dom = document.documentElement
            const COLOR_WEAK = 'invert-mode'
            const COLOR_GRAY = 'grayscale-mode'

            colorWeakMode ? dom.classList.add(COLOR_WEAK) : dom.classList.remove(COLOR_WEAK)
            colorGrayMode ? dom.classList.add(COLOR_GRAY) : dom.classList.remove(COLOR_GRAY)
        }
    }
}

const preferencesManager = new PreferenceManager()

export { PreferenceManager, preferencesManager }
