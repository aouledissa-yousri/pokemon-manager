import { SpaceDocument } from "../../schemas/space.schema"
import { SpaceApiResponse } from "../api-responses/space.api-response"
import { PokemonApiResponse } from "../../../../pokemon-management/pokemon/DTOs/api-responses/pokemon.api-response"


interface _SpaceMapper {
    readonly mapToApiResponse: (space: SpaceDocument, pokemon: PokemonApiResponse[]) => SpaceApiResponse
}

export const SpaceMapper: _SpaceMapper = Object.freeze({

    mapToApiResponse: (space: SpaceDocument, pokemon: PokemonApiResponse[]) => ({
        id: space.id,
        trainerId: space.trainerId,
        name: space.name,
        metLocation: space.metLocation,
        pokemon,
        createdAt: space.createdAt,
    }),
})
