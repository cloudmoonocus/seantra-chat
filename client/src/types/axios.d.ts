export declare module 'axios' {
    export interface AxiosRequestConfig {
        /**
         * @description 请求头是否需要携带 token；true -> 不需要，false -> 需要；如果不需要，手动在请求时设置 noAuth: true
         * @default undefined
         */
        noAuth?: boolean;
    }
}
