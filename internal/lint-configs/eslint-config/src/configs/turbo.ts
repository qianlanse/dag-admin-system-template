import type { Linter } from 'eslint'

// import { interopDefault } from '../util'

/**
 * turbo规则配置
 * @see https://www.npmjs.com/package/eslint-config-turbo
 */
export async function turbo(): Promise<Linter.Config[]> {
    // const [pluginTurbo] = await Promise.all([
    //     interopDefault(import('eslint-config-turbo'))
    // ] as const)

    // return [
    //     {
    //         plugins: {
    //             turbo: pluginTurbo
    //         }
    //     }
    // ]
    return []
}
