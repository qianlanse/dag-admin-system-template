import type { PluginOption } from 'vite'

import fs from 'node:fs'
import fsp from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { readPackageJSON } from '@dag/node-utils'

/**
 * 获取loading的html模板
 * @param loadingTemplate
 * @returns string
 */
async function getLoadingRawByHtmlTemplate(loadingTemplate: string) {
    let appLoadingPath = join(process.cwd(), loadingTemplate)

    if (!fs.existsSync(appLoadingPath)) {
        const __dirname = fileURLToPath(new URL('.', import.meta.url))
        appLoadingPath = join(__dirname, './default-loading.html')
    }

    return await fsp.readFile(appLoadingPath, 'utf8')
}

/**
 * 用于生成将loading样式注入到项目中
 * 为多app提供loading样式，无需在每个app->index.html单独引入
 * @param isBuild
 * @param env
 * @param loadingTemplate
 * @returns Promise<PluginOption | undefined>
 */
async function viteInjectAppLoadingPlugin(
    isBuild: boolean,
    env: Record<string, any> = {},
    loadingTemplate = 'loading.html'
): Promise<PluginOption | undefined> {
    const loadingHtml = await getLoadingRawByHtmlTemplate(loadingTemplate)
    const { version } = await readPackageJSON(process.cwd())
    const envRaw = isBuild ? 'prod' : 'dev'
    const cacheName = `'${env.VITE_APP_NAMESPACE}-${version}-${envRaw}-preferences-theme'`

    // 获取缓存主题
    // 确保黑暗主题下刷新页面时Loading也是黑暗主题
    const injectScript = `
        <script data-app-loading="inject-js">
            var theme = localStorage.getItem(${cacheName});
            document.documentElement.classList.toggle('dark', /dark/.test(theme))
        </script>
    `

    if (!loadingHtml) {
        return
    }

    return {
        enforce: 'pre',
        name: 'vite:inject-app-loading',
        transformIndexHtml: {
            handler(html) {
                const reg = /<body\s*>/
                html = html.replace(reg, `<body>${injectScript}${loadingHtml}`)
                return html
            },
            order: 'pre'
        }
    }
}

export { viteInjectAppLoadingPlugin }
