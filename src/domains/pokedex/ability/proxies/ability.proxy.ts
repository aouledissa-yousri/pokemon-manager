import { ApiResponseWrapper } from "../../../shared/DTOs/wrappers/api-response.wrapper"
import { ApiFactory } from "../../../shared/factories/api.factory"
import { ServerRoutesConfig } from "@/src/global/configs/routes/server-routes.config"


const abilityApi = ApiFactory.createApi(ServerRoutesConfig.POKEDEX_ABILITIES)

interface _AbilityProxy {
    readonly findAbilityList: () => Promise<ApiResponseWrapper<string[] | null>>
}


export const abilityProxy: _AbilityProxy = Object.freeze({

    findAbilityList: async () => {
        const response = await abilityApi.get("")
        return response.data
    },
})
