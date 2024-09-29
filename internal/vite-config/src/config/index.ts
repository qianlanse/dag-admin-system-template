import type { DefineConfig } from '../typing'

import { existsSync } from 'node:fs'
import { join } from 'node:path'

import { defineApplicationConfig } from './application'
import { defineLibraryConfig } from './library'

export * from './application'
export * from './library'

export function defineConfig(
    userConfigPromise?: DefineConfig,
    type: 'application' | 'auto' | 'library' = 'auto'
) {
    let projectType = type

    if (type === 'auto') {
        const htmlPath = join(process.cwd(), 'index.html')
        projectType = existsSync(htmlPath) ? 'application' : 'library'
    }

    switch (projectType) {
        case 'application': {
            return defineApplicationConfig(userConfigPromise)
        }
        case 'library': {
            return defineLibraryConfig(userConfigPromise)
        }
        default: {
            throw new Error(`Un supported project type: ${projectType}`)
        }
    }
}
