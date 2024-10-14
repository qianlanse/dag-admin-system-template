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

export { initPreferences, preferences, updatePreferences }

export * from './constants'
export type * from './types'
export * from './use-preferences'
