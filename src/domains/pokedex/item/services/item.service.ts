import { ApiResponseWrapper } from "../../../shared/DTOs/wrappers/api-response.wrapper"
import { ApiResponseFactory } from "../../../shared/factories/api-response.factory"
import { PokeApiConfig } from "../../shared/configs/pokeapi.config"
import { PokeApiCacheHelper } from "../../shared/helpers/pokeapi-cache.helper"
import { PokeApiFetchHelper } from "../../shared/helpers/pokeapi-fetch.helper"


interface _ItemService {
    readonly findItemList: () => Promise<ApiResponseWrapper<string[] | null>>
}


export const itemService: _ItemService = Object.freeze({

    findItemList: async () => {
        try {
            const items = await PokeApiCacheHelper.getOrFetch("item-list", async () => {

                const payload = await PokeApiFetchHelper.fetchJson(`${PokeApiConfig.BASE_URL}/item?limit=${PokeApiConfig.LIST_LIMIT}`)
                return (payload.results as { name: string }[]).map(entry => entry.name)
            })

            return ApiResponseFactory.success(items, "Item List")
        } catch {
            return ApiResponseFactory.failure(502, "Failed to load items from PokeAPI")
        }
    },
})
