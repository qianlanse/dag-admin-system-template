import type { ComponentInternalInstance, VNode, VNodeChild, VNodeNormalizedChildren } from 'vue'

import { isVNode } from 'vue'

type RowSlots = Exclude<VNodeNormalizedChildren, Array<any> | null | string>
type VNodeChildAtom = Exclude<VNodeChild, Array<any>>
type FlattenVNodes = Array<RowSlots | VNodeChildAtom>

/**
 * 扁平化children
 * @param children
 */
function flattedChildren(children: FlattenVNodes | VNode | VNodeNormalizedChildren): FlattenVNodes {
    const vNodes = Array.isArray(children) ? children : [children]
    const result: FlattenVNodes = []

    vNodes.forEach((child) => {
        if (Array.isArray(child)) {
            result.push(...flattedChildren(child))
        } else if (isVNode(child) && Array.isArray(child.children)) {
            result.push(...flattedChildren(child.children))
        } else {
            result.push(child)
            if (isVNode(child) && child.component?.subTree) {
                result.push(...flattedChildren(child.component.subTree))
            }
        }
    })

    return result
}

/**
 * 向上找到父组件
 * @param instance
 * @param parentNames
 */
function findComponentUpward(instance: ComponentInternalInstance, parentNames: string[]) {
    let parent = instance.parent
    while (parent && !parentNames.includes(parent?.type?.name ?? '')) {
        parent = parent.parent
    }
    return parent
}

export { findComponentUpward, flattedChildren }
