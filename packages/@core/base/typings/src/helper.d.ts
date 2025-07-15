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

type MaybePromise<T> = Promise<T> | T

/** 任意类型的异步函数 */
type AnyPromiseFunction<T extends any[] = any[], R = void> = (...arg: T) => PromiseLike<R>

/** 任意类型的普通函数 */
type AnyNormalFunction<T extends any[] = any[], R = void> = (...arg: T) => R

/** 任意类型的函数 */
type AnyFunction<T extends any[] = any[], R = void> =
    | AnyNormalFunction<T, R>
    | AnyPromiseFunction<T, R>

export type {
    AnyFunction,
    AnyNormalFunction,
    AnyPromiseFunction,
    DeepPartial,
    MaybeComputedRef,
    MaybePromise,
    MaybeReadonlyRef,
    NNonNullable,
    Nullable,
    Recordable
}
