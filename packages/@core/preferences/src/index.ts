import { preferencesManager } from './preferences'

const initPreferences = preferencesManager.initPreferences.bind(preferencesManager)

export { initPreferences }

export * from './constants'
export type * from './types'
