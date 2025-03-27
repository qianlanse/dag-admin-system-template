import type { ComputedRef, MaybeRef } from 'vue'

/**
 * T | null 包装
 */
type Nullable<T> = null | T

/**
 * T | Not null 包装
 */
type NNonNullable<T> = T extends null | undefined ? never : T

/**
 * 也许它是一个计算的 ref，或者一个 getter 函数
 */
type MaybeReadonlyRef<T> = (() => T) | ComputedRef<T>

/**
 * 也许它是一个 ref，或者一个普通值，或者一个 getter 函数
 */
type MaybeComputedRef<T> = MaybeReadonlyRef<T> | MaybeRef<T>

/**
 * 字符创类型对象
 */
type Recordable<T> = Record<string, T>

/**
 * 深层递归所有属性为可选
 */
type DeepPartial<T> = T extends object
    ? {
          [P in keyof T]?: DeepPartial<T[P]>
      }
    : T

export type { DeepPartial, MaybeComputedRef, MaybeReadonlyRef, NNonNullable, Nullable, Recordable }
