import type { CAC } from 'cac'

import { getPackages } from '@dag/node-utils'

import depcheck from 'depcheck'

async function runDepcheck() {
    const { packages } = await getPackages()
    await Promise.all(
        packages.map(async (pkg) => {
            if (
                [
                    '@dag/backend-mock',
                    '@dag/commitlint-config',
                    '@dag/eslint-config',
                    '@dag/lint-staged-config',
                    '@dag/node-utils',
                    '@dag/prettier-config',
                    '@dag/stylelint-config',
                    '@dag/tailwind-config',
                    '@dag/tsconfig',
                    '@dag/vite-config',
                    '@dag/vsh'
                ].includes(pkg.packageJson.name)
            ) {
                return
            }

            const unused = await depcheck(pkg.dir, {
                // 忽略与这些匹配的依赖关系
                ignoreMatches: [
                    'vite',
                    'vitest',
                    'unbuild',
                    '@dag/tsconfig',
                    '@dag/vite-config',
                    '@dag/tailwind-config',
                    '@types/*',
                    '@dag-core/design'
                ],
                // 匹配这些模式的文件将被忽略
                ignorePatterns: ['dist', 'node_modules', 'public']
            })

            // 删除file:前缀的依赖提示，该依赖是本地依赖
            Reflect.deleteProperty(unused.missing, 'file:')
            Object.keys(unused.missing).forEach((key) => {
                unused.missing[key] = (unused.missing[key] || []).filter(
                    (item: string) => !item.startsWith('/')
                )
                if (unused.missing[key].length === 0) {
                    Reflect.deleteProperty(unused.missing, key)
                }
            })

            if (
                Object.keys(unused.missing).length === 0 &&
                unused.dependencies.length === 0 &&
                unused.devDependencies.length === 0
            ) {
                return
            }

            console.error(
                '\n',
                pkg.packageJson.name,
                '\n missing:',
                unused.missing,
                '\n dependencies:',
                unused.dependencies,
                '\n devDependencies:',
                unused.devDependencies
            )
            // console.log(unused.dependencies); // 包含未使用依赖项的阵列
            // console.log(unused.devDependencies); // 包含未使用的Dev依赖性的阵列
            // console.log(unused.missing); // 一个包含“ package.json”中缺少依赖关系的查找以及使用的位置
            // console.log(unused.using); // 查找指示每个依赖关系的查找
            // console.log(unused.invalidFiles); // 无法访问或解析的文件
            // console.log(unused.invalidDirs); // 无法访问的目录
        })
    )
}

/**
 * 检查整个项目依赖情况，并在控制台输出未使用的依赖、未安装的依赖信息
 * @see https://www.npmjs.com/package/depcheck
 * @param cac
 */
function defineDepcheckCommand(cac: CAC) {
    cac.command('check-dep')
        .usage('Analysis of project circular dependencies.')
        .action(async () => {
            await runDepcheck()
        })
}

export { defineDepcheckCommand }
