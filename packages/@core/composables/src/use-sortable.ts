import type Sortable from 'sortablejs'
import type { SortableOptions } from 'sortablejs'

export function useSortable<T extends HTMLElement>(
    sortableContainer: T,
    options: SortableOptions = {}
) {
    const initializeSortable = async () => {
        const Sortable = await import(
            // @ts-expect-error - 这是动态导入
            'sortablejs/modular/sortable.complete.esm.js'
        )
        const sortable = Sortable?.default?.create?.(sortableContainer, {
            animation: 300,
            delay: 400,
            delayOnTouchOnly: true,
            ...options
        })

        return sortable as Sortable
    }

    return {
        initializeSortable
    }
}

export type { Sortable }
