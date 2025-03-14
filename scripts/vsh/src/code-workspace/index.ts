import type { CAC } from 'cac'

import { join, relative } from 'node:path'

import {
    colors,
    consola,
    findMonorepoRoot,
    getPackages,
    gitAdd,
    outputJSON,
    prettierFormat,
    toPosixPath
} from '@dag/node-utils'

interface CodeWorkspaceCommandOptions {
    autoCommit?: boolean
    spaces?: number
}

const CODE_WORKSPACE_FILE = join('dag-admin.code-workspace')

async function createCodeWorkspace({
    autoCommit = false,
    spaces = 2
}: CodeWorkspaceCommandOptions) {
    const { packages, rootDir } = await getPackages()

    let folders = packages.map((pkg) => {
        const { dir, packageJson } = pkg

        return {
            name: packageJson.name,
            path: toPosixPath(relative(rootDir, dir))
        }
    })

    folders = folders.filter(Boolean)

    const monorepoRoot = findMonorepoRoot()
    const outputPath = join(monorepoRoot, CODE_WORKSPACE_FILE)
    await outputJSON(outputPath, { folders }, spaces)

    await prettierFormat(outputPath)
    if (autoCommit) {
        await gitAdd(CODE_WORKSPACE_FILE, monorepoRoot)
    }
}

async function runCodeWorkspace({ autoCommit, spaces }: CodeWorkspaceCommandOptions) {
    await createCodeWorkspace({
        autoCommit,
        spaces
    })
    if (autoCommit) {
        return
    }
    consola.log('')
    consola.success(colors.green(`${CODE_WORKSPACE_FILE} is updated!`))
    consola.log('')
}

/**
 * 生成 dag-admin.code-workspace 文件，目前不需要手动执行，会在代码提交时自动执行
 * @param cac
 */
function defineCodeWorkspaceCommand(cac: CAC) {
    cac.command('code-workspace')
        .usage('Update the `.code-workspace` file')
        .option('--spaces [number]', '.code-workspace JSON file spaces', {
            default: 2
        })
        .option('--auto-commit', 'auto commit .code-workspace JSON file', {
            default: false
        })
        .action(runCodeWorkspace)
}

export { defineCodeWorkspaceCommand }
