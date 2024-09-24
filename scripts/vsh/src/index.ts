import { colors, consola } from '@dag/node-utils'

import cac from 'cac'

import { defineCleanCommand } from './clean'
import { defineLintCommand } from './lint'

try {
    const vsh = cac('vsh')

    // vsh lint
    defineLintCommand(vsh)

    // vsh clean
    defineCleanCommand(vsh)

    vsh.on('command:*', () => {
        consola.error(colors.red('Invalid command.'))
        process.exit(1)
    })

    vsh.usage('vsh')
    vsh.help()
    vsh.parse()
} catch (error) {
    consola.error(error)
    process.exit(1)
}
