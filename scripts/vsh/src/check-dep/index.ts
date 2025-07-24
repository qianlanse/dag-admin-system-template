import type { CAC } from 'cac'

import { getPackages } from '@dag/node-utils'

/**
 * Depcheck是一个用于分析项目中的依赖项的工具，用于查看每个依赖项如何使用，哪些依赖项是无用的，以及package.json中缺少哪些依赖项
 * @see https://www.npmjs.com/package/depcheck
 */
import depcheck from 'depcheck'

// 默认配置
const DEFAULT_CONFIG = {
    // 需要忽略的依赖匹配
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
    // 需要忽略的包
    ignorePackages: [
        '@dag/backend-mock',
        '@dag/commitlint-config',
        '@dag/eslint-config',
        '@dag/node-utils',
        '@dag/prettier-config',
        '@dag/stylelint-config',
        '@dag/tailwind-config',
        '@dag/tsconfig',
        '@dag/vite-config',
        '@dag/vsh'
    ],
    // 需要忽略的文件模式
    ignorePatterns: ['dist', 'node_modules', 'public']
}

interface DepcheckResult {
    dependencies: string[]
    devDependencies: string[]
    missing: Record<string, string[]>
}

interface DepcheckConfig {
    ignoreMatches?: string[]
    ignorePackages?: string[]
    ignorePatterns?: string[]
}

interface PackageInfo {
    dir: string
    packageJson: {
        name: string
    }
}

/**
 * 清理依赖检查结果
 * @param unused - 依赖检查结果
 */
function cleanDepcheckResult(unused: DepcheckResult): void {
    // 删除file:前缀的依赖提示，该依赖是本地依赖
    Reflect.deleteProperty(unused.missing, 'file:')

    // 清理路径依赖
    Object.keys(unused.missing).forEach((key) => {
        unused.missing[key] = (unused.missing[key] || []).filter((item) => !item.startsWith('/'))
        if (unused.missing[key].length === 0) {
            Reflect.deleteProperty(unused.missing, key)
        }
    })
}

/**
 * 格式化依赖检查结果
 * @param pkgName - 包名
 * @param unused - 依赖检查结果
 */
function formatDepcheckResult(pkgName: string, unused: DepcheckResult): void {
    const hasIssues =
        Object.keys(unused.missing).length > 0 ||
        unused.dependencies.length > 0 ||
        unused.devDependencies.length > 0

    if (!hasIssues) {
        return
    }

    console.log('\n📦 Package:', pkgName)

    if (Object.keys(unused.missing).length > 0) {
        console.log('❌ Missing dependencies:')
        Object.entries(unused.missing).forEach(([dep, files]) => {
            console.log(`  - ${dep}:`)
            files.forEach((file) => console.log(`    → ${file}`))
        })
    }

    if (unused.dependencies.length > 0) {
        console.group('⚠️ Unused dependencies:')
        unused.dependencies.forEach((dep) => console.log(`  - ${dep}`))
    }

    if (unused.devDependencies.length > 0) {
        console.log('⚠️ Unused devDependencies:')
        unused.devDependencies.forEach((dep) => console.log(`  - ${dep}`))
    }
}

/**
 * 运行因爱检查
 * @param config 配置选项
 */
async function runDepcheck(config: DepcheckConfig = {}): Promise<void> {
    try {
        const finalConfig = {
            ...DEFAULT_CONFIG,
            ...config
        }

        const { packages } = await getPackages()

        let hasIssues = false

        await Promise.all(
            packages.map(async (pkg: PackageInfo) => {
                // 跳过需要忽略的包
                if (finalConfig.ignorePackages.includes(pkg.packageJson.name)) {
                    return
                }

                const unused = await depcheck(pkg.dir, {
                    ignoreMatches: finalConfig.ignoreMatches,
                    ignorePatterns: finalConfig.ignorePatterns
                })

                cleanDepcheckResult(unused)

                const pkgHasIssues =
                    Object.keys(unused.missing).length > 0 ||
                    unused.dependencies.length > 0 ||
                    unused.devDependencies.length > 0

                if (pkgHasIssues) {
                    hasIssues = true
                    formatDepcheckResult(pkg.packageJson.name, unused)
                }
            })
        )

        if (!hasIssues) {
            console.log('\n✅ Dependency check completed, no issues found')
        }
    } catch (error) {
        console.error('❌ Dependency check failed:', error instanceof Error ? error.message : error)
    }
}

/**
 * 定义依赖检查命令
 * @see https://www.npmjs.com/package/depcheck
 * @param cac
 */
function defineDepcheckCommand(cac: CAC) {
    cac.command('check-dep')
        .option('--ignore-packages <packages>', 'Packages to ignore, comma separated')
        .option('--ignore-matches <matches>', 'Dependency patterns to ignore, comma separated')
        .option('--ignore-patterns <patterns>', 'File patterns to ignore, comma separated')
        .usage('Analysis project dependencies')
        .action(async ({ ignorePackages, ignoreMatches, ignorePatterns }) => {
            const config: DepcheckConfig = {
                ...(ignorePackages && { ignorePackages: ignorePackages.split(',') }),
                ...(ignoreMatches && { ignoreMatches: ignoreMatches.split(',') }),
                ...(ignorePatterns && { ignorePatterns: ignorePatterns.split(',') })
            }

            await runDepcheck(config)
        })
}

export { defineDepcheckCommand }
