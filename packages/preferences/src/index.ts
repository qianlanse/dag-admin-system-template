import type { Preferences } from '@dag-core/preferences'
import type { DeepPartial } from '@dag-core/typings'

/**
 * 如果想所有应用都使用相同的偏好设置，则可以在这里定义
 * 而不是去修改@dag-core/preferences中的默认偏好设置
 * @param preferences
 * @returns 偏好设置
 */
export function defineOverridesPreferences(preferences: DeepPartial<Preferences>) {
    return preferences
}

export * from '@dag-core/preferences'
