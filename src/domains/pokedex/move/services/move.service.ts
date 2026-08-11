import { ApiResponseWrapper } from "../../../shared/DTOs/wrappers/api-response.wrapper"
import { ApiResponseFactory } from "../../../shared/factories/api-response.factory"
import { PokeApiConfig } from "../../shared/configs/pokeapi.config"
import { PokeApiCacheHelper } from "../../shared/helpers/pokeapi-cache.helper"
import { PokeApiFetchHelper } from "../../shared/helpers/pokeapi-fetch.helper"
import { MoveMetadataHelper } from "../helpers/move-metadata.helper"
import { MoveApiResponse } from "../DTOs/api-responses/move.api-response"


interface _MoveService {
    readonly findMoveList: () => Promise<ApiResponseWrapper<MoveApiResponse[] | null>>
}


export const moveService: _MoveService = Object.freeze({

    findMoveList: async () => {
        try {
            const moves = await PokeApiCacheHelper.getOrFetch("move-list-with-metadata", async () => {

                const [moveList, typeByMove, damageClassByMove] = await Promise.all([
                    PokeApiFetchHelper.fetchJson(`${PokeApiConfig.BASE_URL}/move?limit=${PokeApiConfig.LIST_LIMIT}`),
                    MoveMetadataHelper.buildMoveNameMap(
                        `${PokeApiConfig.BASE_URL}/type?limit=${PokeApiConfig.LIST_LIMIT}`,
                        `${PokeApiConfig.BASE_URL}/type`,
                    ),
                    MoveMetadataHelper.buildMoveNameMap(
                        `${PokeApiConfig.BASE_URL}/move-damage-class?limit=${PokeApiConfig.LIST_LIMIT}`,
                        `${PokeApiConfig.BASE_URL}/move-damage-class`,
                    ),
                ])

                return (moveList.results as { name: string }[]).map(entry => ({
                    name: entry.name,
                    type: typeByMove.get(entry.name) ?? null,
                    damageClass: damageClassByMove.get(entry.name) ?? null,
                }))
            })

            return ApiResponseFactory.success(moves, "Move List")
        } catch {
            return ApiResponseFactory.failure(502, "Failed to load moves from PokeAPI")
        }
    },
})
