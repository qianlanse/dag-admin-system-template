import type { RouteRecordStringComponent } from '@dag/types';

import { requestClient } from '#/api/request';

export function getAllMenusApi() {
    return requestClient.get<RouteRecordStringComponent[]>('/menu/all');
}
