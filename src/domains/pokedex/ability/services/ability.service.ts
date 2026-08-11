import { ApiResponseWrapper } from "../../../shared/DTOs/wrappers/api-response.wrapper"
import { ApiResponseFactory } from "../../../shared/factories/api-response.factory"
import { PokeApiConfig } from "../../shared/configs/pokeapi.config"
import { PokeApiCacheHelper } from "../../shared/helpers/pokeapi-cache.helper"


interface _AbilityService {
    readonly findAbilityList: () => Promise<ApiResponseWrapper<string[] | null>>
}


export const abilityService: _AbilityService = Object.freeze({

    findAbilityList: async () => {
        try {
            const abilities = await PokeApiCacheHelper.getOrFetch("ability-list", async () => {

                const response = await fetch(`${PokeApiConfig.BASE_URL}/ability?limit=${PokeApiConfig.LIST_LIMIT}`)
                if (!response.ok) throw new Error("PokeAPI ability list request failed")

                const payload = await response.json()
                return (payload.results as { name: string }[]).map(entry => entry.name)
            })

            return ApiResponseFactory.success(abilities, "Ability List")
        } catch {
            return ApiResponseFactory.failure(502, "Failed to load abilities from PokeAPI")
        }
    },
})
