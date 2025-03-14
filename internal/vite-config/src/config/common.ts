import type { UserConfig } from 'vite'

/**
 * 公共配置
 * @returns Promise<UserConfig>
 */
export async function getCommonConfig(): Promise<UserConfig> {
    return {
        build: {
            // 调整块大小警告限制(以kB为单位)
            chunkSizeWarningLimit: 2000,
            // 设置为false以禁用报告压缩块大小,可以稍微提高构建速度.
            reportCompressedSize: false,
            sourcemap: false
        }
    }
}
