import type { RouteRecordStringComponent } from '@dag/types'

import { requestClient } from '../request'

export function getAllMenusApi() {
    return requestClient.get<RouteRecordStringComponent[]>('/menu/all')
}
