import { ApiResponseWrapper } from "../../../shared/DTOs/wrappers/api-response.wrapper"
import { ApiFactory } from "../../../shared/factories/api.factory"
import { ServerRoutesConfig } from "@/src/global/configs/routes/server-routes.config"
import { SpeciesSummaryApiResponse } from "../DTOs/api-responses/species-summary.api-response"
import { SpeciesDetailApiResponse } from "../DTOs/api-responses/species-detail.api-response"


const speciesApi = ApiFactory.createApi(ServerRoutesConfig.POKEDEX_SPECIES)

interface _SpeciesProxy {
    readonly findSpeciesList: () => Promise<ApiResponseWrapper<SpeciesSummaryApiResponse[] | null>>
    readonly findSpeciesDetail: (speciesId: number) => Promise<ApiResponseWrapper<SpeciesDetailApiResponse | null>>
}


export const speciesProxy: _SpeciesProxy = Object.freeze({

    findSpeciesList: async () => {
        const response = await speciesApi.get("")
        return response.data
    },

    findSpeciesDetail: async (speciesId: number) => {
        const response = await speciesApi.get(`/${speciesId}`)
        return response.data
    },
})
