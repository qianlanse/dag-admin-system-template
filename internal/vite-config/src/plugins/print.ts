import type { PluginOption } from 'vite'

import type { PrintPluginOptions } from '../typing'

import { colors } from '@dag/node-utils'

/**
 * 控制台自定义打印
 * @param options PrintPluginOptions
 * @returns PluginOption
 */
export function vitePrintPlugin(options: PrintPluginOptions = {}): PluginOption {
    const { infoMap = {} } = options

    return {
        configureServer(server) {
            const _printUrls = server.printUrls
            server.printUrls = () => {
                _printUrls()

                for (const [key, value] of Object.entries(infoMap)) {
                    console.log(
                        `  ${colors.green('➜')}  ${colors.bold(key)}: ${colors.cyan(value)}`
                    )
                }
            }
        },
        enforce: 'pre',
        name: 'vite:print-info'
    }
}
