import axios, { AxiosInstance } from "axios"


interface _ApiFactory {
    readonly createApi: (baseUrl: string) => AxiosInstance
}

export const ApiFactory: _ApiFactory = Object.freeze({

    createApi: (baseUrl: string) => axios.create({
        baseURL: baseUrl,
        validateStatus: (status) => status >= 200 && status < 500,
    }),
})
