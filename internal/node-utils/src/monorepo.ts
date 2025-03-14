import { dirname } from 'node:path'

/**
 * 一个简单的实用程序，用于从 monorepo 获取软件包，无论他们使用的是 Yarn、Bolt、Lerna、pnpm 还是 Rush
 * @see https://www.npmjs.com/package/@manypkg/get-packages
 */
import {
    getPackages as getPackagesFunc,
    getPackagesSync as getPackagesSyncFunc
} from '@manypkg/get-packages'
/**
 * 通过遍历父目录来查找文件或目录
 * @see https://www.npmjs.com/package/find-up
 */
import { findUpSync } from 'find-up'

/**
 * 查找大仓的根目录
 * @param cwd
 */
function findMonorepoRoot(cwd: string = process.cwd()) {
    const lockFile = findUpSync('pnpm-lock.yaml', {
        cwd,
        type: 'file'
    })

    return dirname(lockFile || '')
}

async function getPackage(pkgName: string) {
    const { packages } = await getPackages()
    return packages.find((pkg) => pkg.packageJson.name === pkgName)
}

/**
 * 异步获取大仓的所有包
 * @returns '{ dir: string; relativeDir: string; packageJson: object }[]'
 */
async function getPackages() {
    const root = findMonorepoRoot()

    return await getPackagesFunc(root)
}

/**
 * 同步获取大仓的所有包
 */
function getPackagesSync() {
    const root = findMonorepoRoot()
    return getPackagesSyncFunc(root)
}

export { findMonorepoRoot, getPackage, getPackages, getPackagesSync }
