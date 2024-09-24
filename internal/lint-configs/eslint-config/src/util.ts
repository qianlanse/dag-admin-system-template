/**
 * https://stackoverflow.com/questions/51159447/what-is-interoprequiredefault
 */

export type Awaitable<T> = Promise<T> | T

export async function interopDefault<T>(
    m: Awaitable<T>
): Promise<T extends { default: infer U } ? U : T> {
    const resolved = await m
    return (resolved as any).default || resolved
}
