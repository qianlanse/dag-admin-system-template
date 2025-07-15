import { DEFAULT_NAMESPACE } from '@dag-core/shared/constants'

const statePrefix = 'is-'

function _bem(
    namespace: string,
    block: string,
    blockSuffix: string,
    element: string,
    modifier: string
) {
    let cls = `${namespace}-${block}`

    if (blockSuffix) {
        cls += `-${blockSuffix}`
    }

    if (element) {
        cls += `__${element}`
    }

    if (modifier) {
        cls += `--${modifier}`
    }

    return cls
}

function is(name: string, ...args: [] | [boolean | undefined]): string {
    const state = args.length > 0 ? args[0] : true
    return name && state ? `${statePrefix}${name}` : ''
}

function useNamespace(block: string) {
    const namespace = DEFAULT_NAMESPACE

    const b = (blockSuffix = '') => _bem(namespace, block, blockSuffix, '', '')
    const e = (element?: string) => (element ? _bem(namespace, block, '', element, '') : '')
    const m = (element?: string) => (element ? _bem(namespace, block, '', element, '') : '')

    const be = (blockSuffix?: string, element?: string) =>
        blockSuffix && element ? _bem(namespace, block, blockSuffix, element, '') : ''
    const em = (element?: string, modifier?: string) =>
        element && modifier ? _bem(namespace, block, '', element, modifier) : ''
    const bm = (blockSuffix?: string, modifier?: string) =>
        blockSuffix && modifier ? _bem(namespace, block, blockSuffix, '', modifier) : ''

    const bem = (blockSuffix?: string, element?: string, modifier?: string) =>
        blockSuffix && element && modifier
            ? _bem(namespace, block, blockSuffix, element, modifier)
            : ''

    return {
        b,
        be,
        bem,
        bm,
        e,
        em,
        is,
        m
    }
}

export { useNamespace }
