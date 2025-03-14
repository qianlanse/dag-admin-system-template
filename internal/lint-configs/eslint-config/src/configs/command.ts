import createCommand from 'eslint-plugin-command/config'

/**
 * 使用注释触发转换
 * @see https://eslint-plugin-command.antfu.me/guide/install
 */
export async function command() {
    return [
        {
            // @ts-expect-error - no types
            ...createCommand()
        }
    ]
}
