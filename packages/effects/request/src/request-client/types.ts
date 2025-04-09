import type {
    AxiosRequestConfig,
    AxiosResponse,
    CreateAxiosDefaults,
    InternalAxiosRequestConfig
} from 'axios'

/** 扩展 */
type ExtendOptions<T = any> = {
    /**
     * 参数序列化方式
     * - brachets: ids[]=1&ids[]=2&ids[]=3
     * - comma: ids=1,2,3
     * - indices: ids[0]=1&ids[1]=2&ids[1]=3
     * - repeat: ids=1&ids=2&ids=3
     */
    paramsSerializer?:
        | 'brachets'
        | 'comma'
        | 'indices'
        | 'repeat'
        | AxiosRequestConfig<T>['paramsSerializer']

    /**
     * 响应数据的返回方式
     * - body: 返回响应数据的BODY部分（只会根据status检查请求是否成功，忽略对code的判断，这种情况下应由调用方检查请求是否成功）
     * - data: 解构响应的BODY数据，只返回其中的data节点数据（会检查status和code是否为成功状态）
     * - raw: 原始的AxiosResponse，包括headers、status等，不做是否成功请求的检查
     */
    responseReturn?: 'body' | 'data' | 'raw'
}

type RequestClientOptions = CreateAxiosDefaults & ExtendOptions

type RequestClientConfig<T = any> = AxiosRequestConfig<T> & ExtendOptions<T>

type RequestResponse<T = any> = AxiosResponse<T> & {
    config: RequestClientConfig<T>
}

/** 请求拦截器配置 */
interface RequestInterceptorConfig {
    /** 符合条件的 */
    fulfilled?: (
        config: ExtendOptions & InternalAxiosRequestConfig
    ) =>
        | (ExtendOptions & InternalAxiosRequestConfig)
        | Promise<ExtendOptions & InternalAxiosRequestConfig<any>>
    /** 拒绝的 */
    rejected?: (error: any) => any
}

/** 响应拦截器配置 */
interface ResponseInterceptorConfig<T = any> {
    fulfilled?: (response: RequestResponse<T>) => Promise<RequestResponse> | RequestResponse
    rejected?: (error: any) => any
}

export type {
    RequestClientConfig,
    RequestClientOptions,
    RequestInterceptorConfig,
    ResponseInterceptorConfig
}
