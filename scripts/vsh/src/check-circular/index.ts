import type { CAC } from 'cac'

import { extname } from 'node:path'

import { getStagedFiles } from '@dag/node-utils'

import { circularDepsDetect, printCircles } from 'circular-dependency-scanner'

interface CommandOptions {
    staged: boolean
    verbose: boolean
}

const IGNORE_DIR = [
    'dist',
    '.turbo',
    'output',
    '.cache',
    'scripts',
    'internal',
    'packages/effects/request/src/',
    'packages/@core/ui-kit/menu-ui/src/',
    'packages/@core/ui-kit/popup-ui/src'
].join(',')

const IGNORE = [`**/${IGNORE_DIR}/**`]

async function checkCircular({ staged, verbose }: CommandOptions) {
    const results = await circularDepsDetect({
        absolute: staged,
        cwd: process.cwd(),
        ignore: IGNORE
    })

    if (staged) {
        let files = await getStagedFiles()

        const allowedExtensions = new Set(['.cjs', '.js', '.jsx', '.mjs', '.ts', '.tsx', '.vue'])

        files = files.filter((file) => allowedExtensions.has(extname(file)))

        const circularFiles: string[][] = []

        for (const file of files) {
            for (const result of results) {
                const resultFiles = result.flat()
                if (resultFiles.includes(file)) {
                    circularFiles.push(result)
                }
            }
        }

        verbose && printCircles(circularFiles)
    } else {
        verbose && printCircles(results)
    }
}

/**
 * 检查整个项目循环引用，如果有循环引用，会在控制台输出循环引用的模块
 * @param cac
 */
function defineCheckCircularCommand(cac: CAC) {
    cac.command('check-circular')
        .option(
            // 只检查git暂存区内的文件,默认false
            '--staged',
            // 是否是分阶段的提交模式，在哪种模式，如果有循环依赖性，将发出警报
            'Whether it is the staged commit mode, in which mode, if there is a circular dependency, an alarm will be given.',
            {
                default: false
            }
        )
        .usage('Analysis of project circular dependencies.')
        .action(async ({ staged }) => {
            await checkCircular({ staged, verbose: true })
        })
}

export { defineCheckCircularCommand }
