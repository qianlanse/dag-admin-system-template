import type { UserConfig } from 'vite'

import type { DefineApplicationOptions } from '../typing'

import { relative, sep } from 'node:path'

import { findMonorepoRoot } from '@dag/node-utils'

import { defineConfig, loadEnv, mergeConfig } from 'vite'

import { getDefaultPwaOptions } from '../options'
import { loadApplicationPlugins } from '../plugins'
import { loadAndConvertEnv } from '../utils/env'
import { getCommonConfig } from './common'

// 处理全局Scss|Less变量
function createCssOptions(injectGlobalScss = true) {
    const root = findMonorepoRoot()

    return {
        preprocessorOptions: injectGlobalScss
            ? {
                  scss: {
                      additionalData: (content: string, filepath: string) => {
                          const relativePath = relative(root, filepath)
                          if (relativePath.startsWith(`apps${sep}`)) {
                              return `@import "@dag/styles/global";\n${content}`
                          }
                          return content
                      },
                      api: 'modern-compiler'
                  }
              }
            : {}
    }
}

/**
 * 应用配置信息
 * @param userConfigPromise
 * @returns UserConfigExport
 */
export function defineApplicationConfig(userConfigPromise?: DefineApplicationOptions) {
    return defineConfig(async (config) => {
        const options = await userConfigPromise?.(config)
        const { appTitle, base, port, ...envConfig } = await loadAndConvertEnv()
        const { command, mode } = config
        const { application = {}, vite = {} } = options || {}
        const root = process.cwd()
        const isBuild = command === 'build'
        const env = loadEnv(mode, root)

        const { injectGlobalScss = true } = application

        const plugins = await loadApplicationPlugins({
            archiver: true,
            archiverPluginOptions: {},
            devtools: true,
            env,
            html: true,
            i18n: true,
            injectAppLoading: true,
            injectMetadata: true,
            print: !isBuild,
            printInfoMap: {
                'Dag Admin Docs': 'https://doc.dagteam.cn'
            },
            pwa: true,
            pwaOptions: getDefaultPwaOptions(appTitle),
            ...envConfig,
            ...application
        })

        const applicationConfig: UserConfig = {
            base,
            build: {
                rollupOptions: {
                    output: {
                        assetFileNames: '[ext]/[name]-[hash].[ext]',
                        chunkFileNames: 'js/[name]-[hash].mts',
                        entryFileNames: 'jse/index-[name]-[hash].mjs'
                    }
                },
                target: 'es2015'
            },
            css: createCssOptions(injectGlobalScss),
            esbuild: {
                drop: isBuild ? ['debugger'] : [],
                legalComments: 'none'
            },
            plugins,
            server: {
                host: true,
                port,
                warmup: {
                    // 预加载文件
                    clientFiles: [
                        './index.html',
                        './bootstrap.ts',
                        './src/{views,layouts,router,store,api}/*'
                    ]
                }
            }
        }

        const mergedCommonConfig = mergeConfig(await getCommonConfig(), applicationConfig)
        return mergeConfig(mergedCommonConfig, vite)
    })
}
