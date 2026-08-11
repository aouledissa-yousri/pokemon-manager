import { ApiResponseWrapper } from "../../../shared/DTOs/wrappers/api-response.wrapper"
import { ApiResponseFactory } from "../../../shared/factories/api-response.factory"
import { PokeApiConfig } from "../../shared/configs/pokeapi.config"
import { PokeApiCacheHelper } from "../../shared/helpers/pokeapi-cache.helper"
import { SpeciesSummaryApiResponse } from "../DTOs/api-responses/species-summary.api-response"
import { SpeciesDetailApiResponse } from "../DTOs/api-responses/species-detail.api-response"
import { SpeciesMapper } from "../DTOs/mappers/species.mapper"


interface _SpeciesService {
    readonly findSpeciesList: () => Promise<ApiResponseWrapper<SpeciesSummaryApiResponse[] | null>>
    readonly findSpeciesDetail: (speciesId: number) => Promise<ApiResponseWrapper<SpeciesDetailApiResponse | null>>
}


export const speciesService: _SpeciesService = Object.freeze({

    findSpeciesList: async () => {
        try {
            const speciesList = await PokeApiCacheHelper.getOrFetch("species-list", async () => {

                const response = await fetch(`${PokeApiConfig.BASE_URL}/pokemon?limit=${PokeApiConfig.LIST_LIMIT}`)
                if (!response.ok) throw new Error("PokeAPI species list request failed")

                const payload = await response.json()
                return (payload.results as { name: string, url: string }[]).map(SpeciesMapper.mapToSummary)
            })

            return ApiResponseFactory.success(speciesList, "Species List")
        } catch {
            return ApiResponseFactory.failure(502, "Failed to load species from PokeAPI")
        }
    },

    findSpeciesDetail: async (speciesId: number) => {
        try {
            const detail = await PokeApiCacheHelper.getOrFetch<SpeciesDetailApiResponse | null>(`species-detail-${speciesId}`, async () => {

                const response = await fetch(`${PokeApiConfig.BASE_URL}/pokemon/${speciesId}`)
                if (response.status === 404) return null
                if (!response.ok) throw new Error("PokeAPI species detail request failed")

                return SpeciesMapper.mapToDetail(await response.json())
            })

            if (!detail) return ApiResponseFactory.failure(404, "Species not found")
            return ApiResponseFactory.success(detail, "Species Detail")
        } catch {
            return ApiResponseFactory.failure(502, "Failed to load species from PokeAPI")
        }
    },
})
