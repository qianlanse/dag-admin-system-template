import type { NormalizedOutputOptions, OutputBundle, OutputChunk } from 'rollup'
import type { PluginOption } from 'vite'

import { EOL } from 'node:os'

import { dateUtil, readPackageJSON } from '@dag/node-utils'

/**
 * 用于注入版权信息
 */
export async function viteLicensePlugin(root = process.cwd()): Promise<PluginOption | undefined> {
    const { description = '', homepage = '', version = '' } = await readPackageJSON(root)

    return {
        apply: 'build',
        enforce: 'post',
        generateBundle: {
            handler: (_options: NormalizedOutputOptions, bundle: OutputBundle) => {
                const date = dateUtil().format('YYYY-MM-DD')
                const copyrightText = `/*!
                    * Dag Admin
                    * Version: ${version}
                    * Author: dag
                    * Copyright (C) 2025 Dag
                    * License: MIT License
                    * Description: ${description}
                    * Date Created: ${date}
                    * Homepage: ${homepage}
                    * Contact: dag@dagteam.cn
                */`.trim()

                for (const [_, fileContent] of Object.entries(bundle)) {
                    if (fileContent.type === 'chunk' && fileContent.isEntry) {
                        const chunkContent = fileContent as OutputChunk
                        const content = chunkContent.code
                        const updatedContent = `${copyrightText}${EOL}${content}`

                        // 更新bundle
                        ;(fileContent as OutputChunk).code = updatedContent
                    }
                }
            },
            order: 'post'
        },
        name: 'vite:license'
    }
}
