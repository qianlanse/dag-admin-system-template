import { execaCommand, getPackages } from '@dag/node-utils'

import { cancel, isCancel, select } from '@clack/prompts'

interface RunOptions {
    command?: string
}

export async function run(options: RunOptions) {
    const { command } = options

    if (!command) {
        console.error('Please enter the command to run.')
        process.exit(1)
    }

    const { packages } = await getPackages()

    // 筛选对应命令的包
    const selectPkgs = packages.filter((pkg) => {
        return (pkg?.packageJson as Record<string, any>)?.scripts?.[command]
    })

    let selectPkg: string | symbol
    if (selectPkgs.length > 1) {
        selectPkg = await select({
            message: `Select the app you need to run [${command}]:`,
            options: selectPkgs.map((item) => ({
                label: item?.packageJson.name,
                value: item?.packageJson.name
            }))
        })

        if (isCancel(selectPkg) || !selectPkg) {
            cancel(`👋 Has cancelled.`)
            process.exit(1)
        }
    } else {
        selectPkg = selectPkgs[0]?.packageJson?.name ?? ''
    }

    if (!selectPkg) {
        console.error('No app found.')
        process.exit(1)
    }

    execaCommand(`pnpm --filter=${selectPkg} run ${command}`, {
        stdio: 'inherit'
    })
}
