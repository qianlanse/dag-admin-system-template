import dayjs from 'dayjs'

/**
 * 格式化时间
 * @param time 时间戳
 * @param format 格式类型(默认YYYY-MM-DD)
 * @returns string
 * @example '1755744668627' -> '2025-08-21'
 */
function formatDate(time: number | string, format = 'YYYY-MM-DD') {
    try {
        const date = dayjs(time)
        if (!date.isValid()) {
            throw new Error('Invalid date')
        }
        return date.format(format)
    } catch (error) {
        console.error(`Error formatting date: ${error}`)
        return time
    }
}

/**
 * 格式完整时间
 * @param time 时间戳
 * @returns 时间字符串
 * @example '1755744919210' -> '2025-08-21 10:55:36'
 */
function formatDateTime(time: number | string) {
    return formatDate(time, 'YYYY-MM-DD HH:mm:ss')
}

/**
 * 验证是否是时间对象
 * @param value
 * @returns Boolean
 */
function isDate(value: any): value is Date {
    return value instanceof Date
}

/**
 * 验证对象是否是Day.js对象
 * @param value
 * @returns Boolean
 */
function isDayjsObject(value: any): value is dayjs.Dayjs {
    return dayjs.isDayjs(value)
}

export { formatDate, formatDateTime, isDate, isDayjsObject }
