/**
 * T | null 包装
 */
type Nullable<T> = null | T

/**
 * T | Not null 包装
 */
type NNonNullable<T> = T extends null | undefined ? never : T

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

export type { DeepPartial, NNonNullable, Nullable, Recordable }
