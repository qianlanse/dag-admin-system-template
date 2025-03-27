import type { AnyZodObject, ZodDefault, ZodEffects, ZodNumber, ZodString, ZodTypeAny } from 'zod'

import { isObject, isString } from '@dag-core/shared/utils'

/**
 * 获取最低级别的ZOD类型
 */
export function getBaseRules<ChildType extends AnyZodObject | ZodTypeAny = ZodTypeAny>(
    schema: ChildType | ZodEffects<ChildType>
): ChildType | null {
    if (!schema || isString(schema)) return null
    if ('innerType' in schema._def) {
        return getBaseRules(schema._def.innerType as ChildType)
    }
    if ('schema' in schema._def) {
        return getBaseRules(schema._def.schema as ChildType)
    }
    return schema as ChildType
}

/**
 * 在Zod堆栈中搜索“ZodDefault”并返回其值
 */
export function getDefaultValueInZodStack(schema: ZodTypeAny): any {
    if (!schema || isString(schema)) {
        return
    }
    const typedSchema = schema as unknown as ZodDefault<ZodNumber | ZodString>

    if (typedSchema._def.typeName === 'ZodDefault') {
        return typedSchema._def.defaultValue()
    }

    if ('innerType' in typedSchema._def) {
        return getDefaultValueInZodStack(typedSchema._def.innerType as unknown as ZodTypeAny)
    }
    if ('schema' in typedSchema._def) {
        return getDefaultValueInZodStack((typedSchema._def as any).schema as ZodTypeAny)
    }

    return undefined
}

export function isEventObjectLike(obj: any) {
    if (!obj || !isObject(obj)) {
        return false
    }

    return Reflect.has(obj, 'target') && Reflect.has(obj, 'stopPropagation')
}
