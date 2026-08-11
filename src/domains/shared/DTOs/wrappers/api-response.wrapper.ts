export interface ApiResponseWrapper<T> {
    readonly success: boolean
    readonly statusCode: number
    readonly message: string
    readonly data: T
    readonly timestamp: Date
}
