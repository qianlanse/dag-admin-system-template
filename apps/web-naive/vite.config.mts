import { defineConfig } from '@dag/vite-config'

export default defineConfig(async () => {
    return {
        application: {},
        vite: {
            server: {
                proxy: {
                    '/api': {
                        changeOrigin: true,
                        rewrite: (path) => path.replace(/^\/api/, ''),
                        target: 'http://localhost:2016/api',
                        ws: true
                    }
                }
            }
        }
    }
})
