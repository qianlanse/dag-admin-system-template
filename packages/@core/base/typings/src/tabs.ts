import type { RouteLocationNormalized } from 'vue-router'

export interface TabDefinition extends RouteLocationNormalized {
    /**
     * 标签页key
     */
    key?: string
}
