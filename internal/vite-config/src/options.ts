import type { Options as PwaPluginOptions } from 'vite-plugin-pwa'

const isDevelopment = process.env.NODE_ENV === 'development'

/**
 * 获取Pwa默认配置
 * @param name
 * @returns Partial<PwaPluginOptions>
 */
function getDefaultPwaOptions(name: string): Partial<PwaPluginOptions> {
    return {
        manifest: {
            description: 'Dag Admin is a modern admin dashboard template based on Vue3.',
            icons: [
                {
                    sizes: '192x192',
                    src: 'https://unpkg.com/@vbenjs/static-source@0.1.7/source/pwa-icon-192.png',
                    type: 'image/png'
                },
                {
                    sizes: '512x512',
                    src: 'https://unpkg.com/@vbenjs/static-source@0.1.7/source/pwa-icon-512.png',
                    type: 'image/png'
                }
            ],
            name: `${name}${isDevelopment ? ' dev' : ''}`,
            short_name: `${name}${isDevelopment ? ' dev' : ''}`
        }
    }
}

export { getDefaultPwaOptions }
