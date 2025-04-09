import type { ApplicationConfig, DagAdminProAppConfigRaw } from '@dag/types/global'

export function useAppConfig(env: Record<string, any>, isProduction: boolean): ApplicationConfig {
    const config = isProduction ? window._DAG_ADMIN_PRO_APP_CONF_ : (env as DagAdminProAppConfigRaw)

    const { VITE_GLOB_API_URL } = config

    return {
        apiURL: VITE_GLOB_API_URL
    }
}
