import { ApiResponseWrapper } from "../../../shared/DTOs/wrappers/api-response.wrapper"
import { ApiFactory } from "../../../shared/factories/api.factory"
import { ServerRoutesConfig } from "@/src/global/configs/routes/server-routes.config"


const itemApi = ApiFactory.createApi(ServerRoutesConfig.POKEDEX_ITEMS)

interface _ItemProxy {
    readonly findItemList: () => Promise<ApiResponseWrapper<string[] | null>>
}


export const itemProxy: _ItemProxy = Object.freeze({

    findItemList: async () => {
        const response = await itemApi.get("")
        return response.data
    },
})
