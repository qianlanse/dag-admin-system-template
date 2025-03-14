import fs from 'node:fs/promises'

import { format, getFileInfo, resolveConfig } from 'prettier'

/**
 * 手动prettier内容
 * @param {string} filepath - 文件路径
 */
async function prettierFormat(filepath: string) {
    const prettierOptions = await resolveConfig(filepath, {})

    const fileInfo = await getFileInfo(filepath)

    const input = await fs.readFile(filepath, 'utf8')
    const output = await format(input, {
        ...prettierOptions,
        parser: fileInfo.inferredParser as any
    })
    if (output !== input) {
        await fs.writeFile(filepath, output, 'utf8')
    }
    return output
}

export { prettierFormat }
