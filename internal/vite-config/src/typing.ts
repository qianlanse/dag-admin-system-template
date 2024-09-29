import type { PluginVisualizerOptions } from 'rollup-plugin-visualizer'
import type { ConfigEnv, PluginOption, UserConfig } from 'vite'
import type { Options as PwaPluginOptions } from 'vite-plugin-pwa'

interface ConditionPlugin {
    /**
     * 条件是否满足(是否开启)
     */
    condition?: boolean
    /**
     * 插件集合
     * @returns
     */
    plugins: () => PluginOption[] | PromiseLike<PluginOption[]>
}

interface ArchiverPluginOptions {
    /**
     * 输入文件名
     * @default dist
     */
    name?: string
    /**
     * 输入目录
     * @default .
     */
    outputDir?: string
}

interface IImportMap {
    imports?: Record<string, string>
    scopes?: {
        [scope: string]: Record<string, string>
    }
}

/**
 * importmap 插件配置
 */
interface ImportmapPluginOptions {
    /**
     * CDN 供应商
     * @default jspm.io
     */
    defaultProvider?: 'esm.sh' | 'jspm.io'
    /**
     * importmap 配置
     */
    importmap?: Array<{ name: string; range?: string }>
    /**
     * 手动配置importmap
     */
    inputMap?: IImportMap
}

/**
 * 模拟数据插件配置
 */
interface NitroMockPluginOptions {
    /**
     * mock 服务包名
     */
    mockServerPackage?: string
    /**
     * mock 服务端口
     */
    port?: number
    /**
     * mock 是否打印日志
     */
    verbose?: boolean
}

/**
 * 打印数据配置
 */
interface PrintPluginOptions {
    infoMap?: Record<string, string | undefined>
}

/**
 * 公共插件配置
 */
interface CommonPluginOptions {
    /**
     * 是否开启devtools
     */
    devtools?: boolean
    /**
     * 环境变量
     */
    env?: Record<string, any>
    /**
     * 是否注入metadata
     */
    injectMetadata?: boolean
    /**
     * 是否构建模式
     */
    isBuild?: boolean
    /**
     * 构建模式
     */
    mode?: string
    /**
     * 开启依赖分析
     */
    visualizer?: boolean | PluginVisualizerOptions
}

/**
 * 应用配置
 */
interface ApplicationPluginOptions extends CommonPluginOptions {
    /**
     * 是否生成dist.zip(开启后会在打包dist同级生成)
     */
    archiver?: boolean
    /**
     * 压缩归档插件配置
     */
    archiverPluginOptions?: ArchiverPluginOptions
    /**
     * 是否开启压缩
     */
    compress?: boolean
    /**
     * 压缩类型
     */
    compressTypes?: ('brotli' | 'gzip')[]
    /**
     * 是否构建抽离配置文件
     */
    extraAppConfig?: boolean
    /**
     * 是否开启html插件
     */
    html?: boolean
    /**
     * 是否开启i18n插件
     */
    i18n?: boolean
    /**
     * 是否开启importmap CDN
     */
    importmap?: boolean
    /**
     * CDN插件配置
     */
    importmapOptions?: ImportmapPluginOptions
    /**
     * 是否注入App Loading
     */
    injectAppLoading?: boolean
    /**
     * 是否注入全局scss
     */
    injectGlobalScss?: boolean
    /**
     * 是否注入版权信息
     */
    license?: boolean
    /**
     * 是否开启mock数据
     */
    nitroMock?: boolean
    /**
     * mock插件配置
     */
    nitroMockOptions?: NitroMockPluginOptions
    /**
     * 是否开启控制台自定义打印
     */
    print?: boolean
    /**
     * 打印插件配置
     */
    printInfoMap?: PrintPluginOptions['infoMap']
    /**
     * 是否开启pwa
     */
    pwa?: boolean
    /**
     * pwa 插件配置
     */
    pwaOptions?: Partial<PwaPluginOptions>
}

/**
 * 库配置
 */
interface LibraryPluginOptions extends CommonPluginOptions {
    /**
     * 开启 dts 输出
     */
    dts?: boolean
    /**
     * 是否注入lib css
     */
    injectLibCss?: boolean
}

type DefineApplicationOptions = (config: ConfigEnv) => Promise<{
    application?: ApplicationPluginOptions
    vite?: UserConfig
}>

type DefineLibraryOptions = (config: ConfigEnv) => Promise<{
    library?: LibraryPluginOptions
    vite?: UserConfig
}>

type DefineConfig = DefineApplicationOptions | DefineLibraryOptions

export type {
    ApplicationPluginOptions,
    ArchiverPluginOptions,
    CommonPluginOptions,
    ConditionPlugin,
    DefineApplicationOptions,
    DefineConfig,
    DefineLibraryOptions,
    IImportMap,
    ImportmapPluginOptions,
    LibraryPluginOptions,
    NitroMockPluginOptions,
    PrintPluginOptions
}
