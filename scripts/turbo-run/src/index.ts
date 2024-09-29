/**
 * Command And Conquer 是一个用于构建 CLI 应用程序的 JavaScript 库。
 */

import { colors, consola } from '@dag/node-utils'

import { cac } from 'cac'

import { run } from './run'

try {
    const turboRun = cac('turbo-run')

    turboRun
        .command('[script]')
        .usage('Run tuobo interactively.')
        .action(async (command: string) => {
            run({ command })
        })

    turboRun.on('command:*', () => {
        consola.error(colors.red('Invalid command.'))
        process.exit(1)
    })

    turboRun.usage('turbo-run')
    turboRun.help()
    turboRun.parse()
} catch (error) {
    consola.error(error)
    process.exit(1)
}
