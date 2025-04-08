interface FallbackProps {
    /** 页面提示语 */
    title?: string
    /** 描述 */
    description?: string
    /** 首页路由地址 */
    homePath?: string
    /** 默认显示的图片 */
    image?: string
    /** 内置类型 */
    status?: '403' | '404' | '500' | 'coming-soon' | 'offline'
}

export type { FallbackProps }
