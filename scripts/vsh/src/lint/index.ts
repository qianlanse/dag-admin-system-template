/**
 * 格式化样式，规则和检查
 */
import type { CAC } from 'cac'

import { execaCommand } from '@dag/node-utils'

interface LintCommandOptions {
    /**
     * 格式化问题
     */
    format?: boolean
}

async function runLint({ format }: LintCommandOptions) {
    // process.env.FORCE_COLOR = '3'

    if (format) {
        await execaCommand(`stylelint "**/*.{vue,css,less,scss}" --cache --fix`, {
            stdio: 'inherit'
        })
        await execaCommand(`eslint . --cache --fix`, {
            stdio: 'inherit'
        })
        await execaCommand(`prettier . --write --cache --log-level warn`, {
            stdio: 'inherit'
        })
        return
    }
    await Promise.all([
        execaCommand(`eslint . --cache`, {
            stdio: 'inherit'
        }),
        execaCommand(`prettier . --ignore-unknown --check --cache`, {
            stdio: 'inherit'
        }),
        execaCommand(`stylelint "**/*.{vue,css,less.scss}" --cache`, {
            stdio: 'inherit'
        })
    ])
}

/**
 * 对项目进行lint检查，检查项目中的代码是否符合规范
 * @param cac
 */
function defineLintCommand(cac: CAC) {
    cac.command('lint')
        .usage('Betch execute project lint check.')
        .option('--format', 'Format lint problem')
        .action(runLint)
}

export { defineLintCommand }
