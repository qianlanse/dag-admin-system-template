import { createDefu } from 'defu'

export { createDefu as createMerge, defu as merge } from 'defu'

/**
 * 递归分配默认属性
 * 最左侧的参数具有更高的优先级
 * @see https://www.npmjs.com/package/defu
 */
export const mergeWithArrayOverride = createDefu((originObj, key, updates) => {
    if (Array.isArray(originObj[key]) && Array.isArray(updates)) {
        originObj[key] = updates
        return true
    }
})
