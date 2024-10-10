import type { ApplicationPluginOptions } from '../typing'

import { join } from 'node:path'

import { fs } from '@dag/node-utils'

import dotenv from 'dotenv'

const getString = (value: string | undefined, fallback: string) => value ?? fallback
const getNumber = (value: string | undefined, fallback: number) => Number(value) || fallback
const getBoolean = (value: string | undefined) => value === 'true'

/**
 * 获取当前环境下生效的配置文件名
 */
function getConfigFiles() {
    const script = process.env.npm_lifecycle_script as string
    const reg = /--mode ([\d_a-z]+)/
    const result = reg.exec(script)

    if (result) {
        const mode = result[1]
        return ['.env', `.env.${mode}`]
    }

    return ['.env', '.env.production']
}

/**
 * 加载配置信息
 */
export async function loadEnv<T = Record<string, string>>(
    match = 'VITE_GLOB_',
    confFiles = getConfigFiles()
) {
    let envConfig = {}

    for (const confFile of confFiles) {
        try {
            const envPath = await fs.readFile(join(process.cwd(), confFile), {
                encoding: 'utf8'
            })
            const env = dotenv.parse(envPath)
            envConfig = { ...envConfig, ...env }
        } catch (error) {
            console.error(`Error while parsing ${confFile}:`, error)
        }
    }
    const reg = new RegExp(`^(${match})`)
    Object.keys(envConfig).forEach((key) => {
        if (!reg.test(key)) {
            Reflect.deleteProperty(envConfig, key)
        }
    })
    return envConfig as T
}

type EnvPromiseResult = {
    appTitle: string
    base: string
    port: number
} & Partial<ApplicationPluginOptions>

/**
 * 获取本地env配置信息
 * @param match
 * @param confFiles
 * @returns Promise<EnvPromiseResult>
 */
export async function loadAndConvertEnv(
    match = 'VITE_',
    confFiles = getConfigFiles()
): Promise<EnvPromiseResult> {
    const envConfig = await loadEnv(match, confFiles)

    const { VITE_APP_TITLE, VITE_ARCHIVER, VITE_BASE, VITE_PORT } = envConfig

    return {
        appTitle: getString(VITE_APP_TITLE, 'Dag Admin'),
        archiver: getBoolean(VITE_ARCHIVER),
        base: getString(VITE_BASE, '/'),
        port: getNumber(VITE_PORT, 9527)
    }
}
