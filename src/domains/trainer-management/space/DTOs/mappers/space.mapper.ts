import { SpaceDocument } from "../../schemas/space.schema"
import { SpaceApiResponse } from "../api-responses/space.api-response"
import { PokemonApiResponse } from "../../../../pokemon-management/pokemon/DTOs/api-responses/pokemon.api-response"


interface _SpaceMapper {
    readonly mapToApiResponse: (space: SpaceDocument, pokemon: PokemonApiResponse[], childSpaces: SpaceApiResponse[]) => SpaceApiResponse
    readonly buildTree: (spaces: SpaceDocument[], pokemonBySpaceId: Map<number, PokemonApiResponse[]>) => SpaceApiResponse[]
}

export const SpaceMapper: _SpaceMapper = Object.freeze({

    mapToApiResponse: (space: SpaceDocument, pokemon: PokemonApiResponse[], childSpaces: SpaceApiResponse[]) => ({
        id: space.id,
        trainerId: space.trainerId,
        parentSpaceId: space.parentSpaceId,
        name: space.name,
        metLocation: space.metLocation,
        pokemon,
        childSpaces,
        createdAt: space.createdAt,
    }),

    buildTree: (spaces: SpaceDocument[], pokemonBySpaceId: Map<number, PokemonApiResponse[]>) => {

        const byParentId = new Map<number | null, SpaceDocument[]>()

        spaces.forEach(space => {
            const siblings = byParentId.get(space.parentSpaceId) ?? []
            siblings.push(space)
            byParentId.set(space.parentSpaceId, siblings)
        })

        const build = (parentId: number | null): SpaceApiResponse[] =>
            (byParentId.get(parentId) ?? []).map(space => SpaceMapper.mapToApiResponse(
                space,
                pokemonBySpaceId.get(space.id) ?? [],
                build(space.id),
            ))

        return build(null)
    },
})
