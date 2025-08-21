/**
 * 查看bind,call,apply区别(定义this指向)
 * bind 返回是函数(所有参数放到一个数组)
 * call, apply的参数依次逗号隔开放后面
 * @see https://www.runoob.com/w3cnote/js-call-apply-bind.html
 */

import type { Preferences } from './types'

import { preferencesManager } from './preferences'

const preferences: Preferences = preferencesManager.getPreferences.apply(preferencesManager)

/**
 * 初始化偏好设置
 */
const initPreferences = preferencesManager.initPreferences.bind(preferencesManager)

/**
 * 更新偏好设置
 */
const updatePreferences = preferencesManager.updatePreferences.bind(preferencesManager)

/**
 * 重置偏好设置
 */
const resetPreferences = preferencesManager.resetPreferences.bind(preferencesManager)

/**
 * 清除偏好设置缓存
 */
const clearPreferencesCache = preferencesManager.clearCache.bind(preferencesManager)

export { clearPreferencesCache, initPreferences, preferences, resetPreferences, updatePreferences }

export * from './constants'
export type * from './types'
export * from './use-preferences'
