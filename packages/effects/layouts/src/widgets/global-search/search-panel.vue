<script setup lang="ts">
    import type { MenuRecordRaw } from '@dag/types'

    import { computed, nextTick, onMounted, ref, shallowRef, watch } from 'vue'
    import { useRouter } from 'vue-router'

    import { SearchX, X } from '@dag/icons'
    import { $t } from '@dag/locales'
    import { isHttpUrl, mapTree, traverseTreeValues, uniqueByField } from '@dag/utils'

    import { DagIcon } from '@dag-core/shadcn-ui'

    import { onKeyStroke, useLocalStorage, useThrottleFn } from '@vueuse/core'

    defineOptions({
        name: 'SearchPanel'
    })

    const props = withDefaults(defineProps<{ keyword?: string; menus?: MenuRecordRaw[] }>(), {
        keyword: '',
        menus: () => []
    })
    const emits = defineEmits<{ close: [] }>()

    const router = useRouter()
    const searchHistory = useLocalStorage<MenuRecordRaw[]>(
        `__search-history-${location.hostname}__`,
        []
    )

    /** 搜索需要转义的特殊字符 */
    const codes = new Set(['$', '(', ')', '*', '+', '.', '?', '[', '\\', ']', '^', '{', '|', '}'])

    const activeIndex = ref(-1)
    const searchResults = ref<MenuRecordRaw[]>([])
    const searchItems = shallowRef<MenuRecordRaw[]>([])

    const filterList = computed(() => uniqueByField(searchResults.value, 'path'))

    watch(
        () => props.keyword,
        (val) => {
            if (val) {
                searchThrottle(val)
            } else {
                searchResults.value = [...searchHistory.value]
            }
        }
    )

    onMounted(() => {
        searchItems.value = mapTree(props.menus, (item) => {
            return {
                ...item,
                name: $t(item?.name)
            }
        })
        if (searchHistory.value.length > 0) {
            searchResults.value = searchHistory.value
        }

        onKeyStroke('Enter', handleEnter)
        onKeyStroke('ArrowUp', handleUp)
        onKeyStroke('ArrowDown', handleDown)
        onKeyStroke('Escape', handleClose)
    })

    /** functions */
    const searchThrottle = useThrottleFn(handleSearch, 200)

    /** 搜索 */
    function handleSearch(searchKey: string) {
        // 去除搜索关键词的前后空格
        searchKey = searchKey.trim()

        // 如果搜索关键词为空，清空搜索结果并返回
        if (!searchKey) {
            searchResults.value = []
            return
        }

        // 使用搜索关键词创建正则表达式
        const reg = createSearchReg(searchKey)

        const results: MenuRecordRaw[] = []

        traverseTreeValues(searchItems.value, (item) => {
            if (reg.test(item.name?.toLowerCase())) {
                results.push(item)
            }
        })

        searchResults.value = results

        // 如果有搜索结果，设置索引为 0
        // if (results.length > 0) {
        //     activeIndex.value = 0
        // }

        activeIndex.value = 0
    }

    /** 创建搜索正则表达式 */
    function createSearchReg(key: string) {
        const keys = [...key].map((item) => transform(item)).join('.*')
        return new RegExp(`.*${keys}.*`)
    }

    /** 转换函数用于转义特殊字符 */
    function transform(c: string) {
        return codes.has(c) ? `\\${c}` : c
    }

    /**
     * 当键盘上下键移动到看不见的地方时
     * 滚动条需要自动滚动
     */
    function scrollIntoView() {
        const element = document.querySelector(`[data-search-item="${activeIndex.value}"]`)

        if (element) {
            element.scrollIntoView({ block: 'nearest' })
        }
    }

    /** 移除 */
    function removeItem(index: number) {
        if (props.keyword) {
            searchResults.value.splice(index, 1)
        } else {
            searchHistory.value.splice(index, 1)
        }
        activeIndex.value = Math.max(activeIndex.value - 1, 0)
        scrollIntoView()
    }

    /** 当鼠标移动到某一行时激活 */
    function handleMouseenter(e: MouseEvent) {
        const index = (e.target as HTMLElement)?.dataset.index
        activeIndex.value = Number(index)
    }

    /** 回车按键 */
    async function handleEnter() {
        if (searchResults.value.length === 0) {
            return
        }
        const result = searchResults.value
        const index = activeIndex.value
        if (result.length === 0 || index < 0) {
            return
        }

        const to = result[index]
        if (to) {
            const findTo = searchHistory.value.find((item) => item.path === to.path)
            if (!findTo) {
                searchHistory.value.push(to)
            }
            handleClose()
            await nextTick()
            if (isHttpUrl(to.path)) {
                window.open(to.path, '_blank')
            } else {
                router.push({ path: to.path, replace: true })
            }
        }
    }

    /** 向上按键 */
    function handleUp() {
        if (searchResults.value.length === 0) {
            return
        }

        activeIndex.value--
        if (activeIndex.value < 0) {
            activeIndex.value = searchResults.value.length - 1
        }

        scrollIntoView()
    }

    /** 向下按键 */
    function handleDown() {
        if (searchResults.value.length === 0) {
            return
        }

        activeIndex.value++
        if (activeIndex.value > searchResults.value.length - 1) {
            activeIndex.value = 0
        }

        scrollIntoView()
    }

    /** Esc按键 */
    function handleClose() {
        searchResults.value = []
        emits('close')
    }
</script>

<template>
    <div class="!flex h-full justify-center px-2 sm:max-h-[450px]">
        <!-- 无搜索结果 -->
        <div v-if="keyword && searchResults.length === 0" class="text-muted-foreground text-center">
            <SearchX class="mx-auto mt-4 size-12" />
            <p class="mb-10 mt-6 text-xs">
                {{ $t('ui.widgets.search.noResults') }}
                <span class="text-foreground text-sm font-medium"> "{{ keyword }}" </span>
            </p>
        </div>

        <!-- 历史搜索记录 & 没有搜索结果 -->
        <div v-if="!keyword && searchResults.length === 0">
            <p class="my-10 text-xs">
                {{ $t('ui.widgets.search.noRecent') }}
            </p>
        </div>

        <ul v-show="searchResults.length > 0" class="w-full">
            <li
                v-if="searchHistory.length > 0 && !keyword"
                class="text-muted-foreground mb-2 text-xs"
            >
                {{ $t('ui.widgets.search.recent') }}
            </li>
            <li
                v-for="(item, index) in filterList"
                :key="item.path"
                :class="activeIndex === index ? 'active bg-primary text-primary-foreground' : ''"
                :data-index="index"
                :data-search-item="index"
                class="bg-accent flex-center group mb-3 w-full cursor-pointer rounded-lg p-4"
                @click="handleEnter"
                @mouseenter="handleMouseenter"
            >
                <DagIcon :icon="item.icon" class="mr-2 size-5 flex-shrink-0" fallback />
                <span class="flex-1">{{ item.name }}</span>
                <div
                    class="flex-center dark:hover:bg-accent hover:text-primary-foreground rounded-full p-1 hover:scale-110"
                    @click.stop="removeItem(index)"
                >
                    <X class="size-4" />
                </div>
            </li>
        </ul>
    </div>
</template>
