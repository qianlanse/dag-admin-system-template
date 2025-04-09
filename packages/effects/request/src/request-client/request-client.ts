import type { AxiosInstance } from 'axios'

import type { RequestClientConfig, RequestClientOptions } from './types'

import { bindMethods, isString, merge } from '@dag/utils'

import axios from 'axios'
import qs from 'qs'

import { FileDownloader } from './modules/downloader'
import { InterceptorManager } from './modules/interceptor'
import { FileUploader } from './modules/uploader'

/** 获取参数序列化 */
function getParamsSerializer(paramsSerializer: RequestClientOptions['paramsSerializer']) {
    if (isString(paramsSerializer)) {
        switch (paramsSerializer) {
            case 'brachets': {
                return (params: any) => qs.stringify(params, { arrayFormat: 'brackets' })
            }
            case 'comma': {
                return (params: any) => qs.stringify(params, { arrayFormat: 'comma' })
            }
            case 'indices': {
                return (params: any) => qs.stringify(params, { arrayFormat: 'indices' })
            }
            case 'repeat': {
                return (params: any) => qs.stringify(params, { arrayFormat: 'repeat' })
            }
        }
    }

    return paramsSerializer
}

/**
 * 客户端请求类
 */
class RequestClient {
    public addRequestInterceptor: InterceptorManager['addRequestInterceptor']
    public addResponseInterceptor: InterceptorManager['addResponseInterceptor']

    public download: FileDownloader['download']
    public upload: FileUploader['upload']

    /** 请求实例 */
    private readonly instance: AxiosInstance

    constructor(options: RequestClientOptions = {}) {
        const defaultConfig: RequestClientOptions = {
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            responseReturn: 'raw',
            timeout: 10_000
        }
        const { ...axiosConfig } = options
        const requestConfig = merge(axiosConfig, defaultConfig)
        requestConfig.paramsSerializer = getParamsSerializer(requestConfig.paramsSerializer)
        this.instance = axios.create(requestConfig)

        bindMethods(this)

        // 实例化拦截器
        const interceptorManager = new InterceptorManager(this.instance)
        this.addRequestInterceptor =
            interceptorManager.addRequestInterceptor.bind(interceptorManager)
        this.addResponseInterceptor =
            interceptorManager.addResponseInterceptor.bind(interceptorManager)

        // 实例化文件上传器
        const fileUploader = new FileUploader(this)
        this.upload = fileUploader.upload.bind(fileUploader)

        // 实例化文件下载器
        const fileDownloader = new FileDownloader(this)
        this.download = fileDownloader.download.bind(fileDownloader)
    }

    /** DELETE请求方法 */
    public delete<T = any>(url: string, config?: RequestClientConfig): Promise<T> {
        return this.request<T>(url, { ...config, method: 'DELETE' })
    }

    /** GET请求方法 */
    public get<T = any>(url: string, config?: RequestClientConfig): Promise<T> {
        return this.request<T>(url, { ...config, method: 'GET' })
    }

    /** POST请求方法 */
    public post<T = any>(url: string, data?: any, config?: RequestClientConfig): Promise<T> {
        return this.request<T>(url, { ...config, data, method: 'POST' })
    }

    /** PUT请求方法 */
    public put<T = any>(url: string, data?: any, config?: RequestClientConfig): Promise<T> {
        return this.request<T>(url, { ...config, data, method: 'PUT' })
    }

    /** 通用的请求方法 */
    public async request<T>(url: string, config: RequestClientConfig) {
        try {
            const response = await this.instance({
                url,
                ...config,
                ...(config.paramsSerializer
                    ? { paramsSerializer: getParamsSerializer(config.paramsSerializer) }
                    : {})
            })
            return response as T
        } catch (error: any) {
            throw error.response ? error.response.data : error
        }
    }
}

export { RequestClient }
