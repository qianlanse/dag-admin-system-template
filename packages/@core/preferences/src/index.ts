import type { Preferences } from './types'

import { preferencesManager } from './preferences'

const preferences: Preferences = preferencesManager.getPreferences.apply(preferencesManager)

const initPreferences = preferencesManager.initPreferences.bind(preferencesManager)

export { initPreferences, preferences }

export * from './constants'
export type * from './types'
