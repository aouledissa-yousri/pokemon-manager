import { ApiResponseWrapper } from "../DTOs/wrappers/api-response.wrapper"


interface _ApiResponseFactory {
    readonly success: <T>(data: T, message?: string) => ApiResponseWrapper<T>
    readonly failure: (statusCode: number, message: string) => ApiResponseWrapper<null>
}

export const ApiResponseFactory: _ApiResponseFactory = Object.freeze({

    success: <T>(data: T, message: string = "Success") => ({
        success: true,
        statusCode: 200,
        message,
        data,
        timestamp: new Date(),
    }),

    failure: (statusCode: number, message: string) => ({
        success: false,
        statusCode,
        message,
        data: null,
        timestamp: new Date(),
    }),
})
