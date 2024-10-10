import 'vue-router'

export interface DagAdminProAppConfigRaw {
    VITE_GLOB_API_URL: string
}

declare global {
    interface Window {
        _VBEN_ADMIN_PRO_APP_CONF_: DagAdminProAppConfigRaw
    }
}
