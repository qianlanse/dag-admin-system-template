import type { PluginOption } from 'vite'

import type {
    ApplicationPluginOptions,
    CommonPluginOptions,
    ConditionPlugin,
    LibraryPluginOptions
} from '../typing'

// https://www.npmjs.com/package/@intlify/unplugin-vue-i18n
import viteVueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
import viteVue from '@vitejs/plugin-vue'
import viteVueJsx from '@vitejs/plugin-vue-jsx'
// https://www.npmjs.com/package/rollup-plugin-visualizer
import { visualizer as viteVisualizerPlugin } from 'rollup-plugin-visualizer'
// https://www.npmjs.com/package/vite-plugin-dts
import viteDtsPlugin from 'vite-plugin-dts'
// https://github.com/vbenjs/vite-plugin-html
import { createHtmlPlugin as viteHtmlPlugin } from 'vite-plugin-html'
// https://juejin.cn/post/7214374960192782373
import { libInjectCss as viteLibInjectCss } from 'vite-plugin-lib-inject-css'
import { VitePWA } from 'vite-plugin-pwa'
import viteVueDevTools from 'vite-plugin-vue-devtools'

import { viteArchiverPlugin } from './archiver'
import { viteInjectAppLoadingPlugin } from './inject-app-loading'
import { viteMetadataPlugin } from './inject-metadata'
import { vitePrintPlugin } from './print'

/**
 * 获取通用的Vite插件
 * @param options
 */
async function loadCommonPlugins(options: CommonPluginOptions): Promise<ConditionPlugin[]> {
    const { devtools, injectMetadata, isBuild, visualizer } = options

    return [
        {
            condition: true,
            plugins: () => [viteVue(), viteVueJsx()]
        },
        {
            condition: !isBuild && devtools,
            plugins: () => [viteVueDevTools()]
        },
        {
            condition: injectMetadata,
            plugins: async () => [await viteMetadataPlugin()]
        },
        {
            condition: isBuild && !!visualizer,
            plugins: () => [
                viteVisualizerPlugin({
                    filename: './node_modules/.cache/visualizer/stats.html',
                    gzipSize: true,
                    open: true
                })
            ]
        }
    ]
}

/**
 * 返回满足条件的插件
 * @param conditionPlugins
 * @returns PluginOption[]
 */
async function loadConditionPlugins(conditionPlugins: ConditionPlugin[]) {
    const plugins: PluginOption[] = []
    for (const conditionPlugin of conditionPlugins) {
        if (conditionPlugin.condition) {
            const realPlugins = await conditionPlugin.plugins()
            plugins.push(...realPlugins)
        }
    }
    return plugins.flat()
}

/**
 * 根据条件获取应用类型的vite插件
 * @param options ApplicationPluginOptions
 * @returns Promise<PluginOption[]>
 */
async function loadApplicationPlugins(options: ApplicationPluginOptions): Promise<PluginOption[]> {
    const isBuild = options.isBuild
    const env = options.env

    const {
        archiver,
        archiverPluginOptions,
        // compress,
        // compressTypes,
        // extraAppConfig,
        html,
        i18n,
        // importmap,
        // importmapOptions,
        injectAppLoading,
        // license,
        // nitroMock,
        // nitroMockOptions,
        print,
        printInfoMap,
        pwa,
        pwaOptions,
        ...commonOptions
    } = options

    const commonPlugins = await loadCommonPlugins(commonOptions)

    return await loadConditionPlugins([
        ...commonPlugins,
        {
            condition: i18n,
            plugins: async () => {
                return [
                    viteVueI18nPlugin({
                        // 是否使 vue-i18n API 仅为组合 API
                        compositionOnly: true,
                        // 是否安装Vue I18n提供的全套API、组件等
                        fullInstall: true,
                        // 是否在生产构建中自动使用Vue I18n(仅运行时)
                        runtimeOnly: true
                    })
                ]
            }
        },
        {
            condition: print,
            plugins: async () => {
                return [await vitePrintPlugin({ infoMap: printInfoMap })]
            }
        },
        {
            condition: pwa,
            plugins: () =>
                VitePWA({
                    injectRegister: false,
                    workbox: {
                        globPatterns: []
                    },
                    ...pwaOptions,
                    manifest: {
                        display: 'standalone',
                        start_url: '/',
                        theme_color: '#ffffff',
                        ...pwaOptions?.manifest
                    }
                })
        },
        {
            condition: injectAppLoading,
            plugins: async () => [await viteInjectAppLoadingPlugin(!!isBuild, env)]
        },
        {
            condition: !!html,
            plugins: () => [viteHtmlPlugin({ minify: true })]
        },
        {
            condition: archiver,
            plugins: async () => [await viteArchiverPlugin(archiverPluginOptions)]
        }
    ])
}

/**
 * 根据条件获取库类型的vite插件
 * @param options
 * @returns Promise<PluginOption[]>
 */
async function loadLibraryPlugins(options: LibraryPluginOptions): Promise<PluginOption[]> {
    const isBuild = options.isBuild
    const { dts, injectLibCss, ...commonOptions } = options
    const commonPlugins = await loadCommonPlugins(commonOptions)

    return await loadConditionPlugins([
        ...commonPlugins,
        {
            condition: isBuild && !!dts,
            plugins: () => [viteDtsPlugin({ logLevel: 'error' })]
        },
        {
            condition: injectLibCss,
            plugins: () => [viteLibInjectCss()]
        }
    ])
}

export {
    loadApplicationPlugins,
    loadLibraryPlugins,
    viteDtsPlugin,
    viteHtmlPlugin,
    viteVisualizerPlugin
}
