import { promises as fs } from 'node:fs'
import { dirname } from 'node:path'

/**
 * 写入数据
 * @param filePath 写入路径
 * @param data 写入数据
 * @param spaces 间隔
 */
export async function outputJSON(filePath: string, data: any, spaces: number = 2) {
    try {
        const dir = dirname(filePath)
        await fs.mkdir(dir, { recursive: true })
        const jsonData = JSON.stringify(data, null, spaces)
        await fs.writeFile(filePath, jsonData, 'utf8')
    } catch (error) {
        console.error('Error writing JSON file:', error)
        throw error
    }
}

/**
 * 确保路径存在并写入空数据
 * @param filePath
 */
export async function ensureFile(filePath: string) {
    try {
        const dir = dirname(filePath)
        await fs.mkdir(dir, { recursive: true })
        await fs.writeFile(filePath, '', { flag: 'a' })
    } catch (error) {
        console.error('Error ensuring file:', error)
        throw error
    }
}

/**
 * 读取JSON数据
 * @param filePath - 文件地址
 * @returns 对象数据
 */
export async function readJSON(filePath: string) {
    try {
        const data = await fs.readFile(filePath, 'utf8')
        return data ? JSON.parse(data) : {}
    } catch (error) {
        console.error('Error reading JSON file:', error)
        throw error
    }
}
