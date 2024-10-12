import { defineConfig } from '@dag/vite-config'

export default defineConfig(async () => {
    return {
        vite: {
            publicDir: 'src/scss-bem'
        }
    }
})
