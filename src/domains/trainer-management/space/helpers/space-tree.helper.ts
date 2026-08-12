import { SpaceApiResponse } from "../DTOs/api-responses/space.api-response"
import { PokemonApiResponse } from "../../../pokemon-management/pokemon/DTOs/api-responses/pokemon.api-response"


export interface PokemonWithSpace {
    readonly pokemon: PokemonApiResponse
    readonly space: SpaceApiResponse
}

interface _SpaceTreeHelper {
    readonly findSpaceById: (spaces: SpaceApiResponse[], spaceId: number) => SpaceApiResponse | null
    readonly updateSpaceById: (spaces: SpaceApiResponse[], spaceId: number, updater: (space: SpaceApiResponse) => SpaceApiResponse) => SpaceApiResponse[]
    readonly removeSpaceById: (spaces: SpaceApiResponse[], spaceId: number) => SpaceApiResponse[]
    readonly mapAllSpaces: (spaces: SpaceApiResponse[], transform: (space: SpaceApiResponse) => SpaceApiResponse) => SpaceApiResponse[]
    readonly countAllSpaces: (spaces: SpaceApiResponse[]) => number
    readonly countAllPokemon: (spaces: SpaceApiResponse[]) => number
    readonly getAllPokemonWithSpace: (spaces: SpaceApiResponse[]) => PokemonWithSpace[]
}

export const SpaceTreeHelper: _SpaceTreeHelper = Object.freeze({

    findSpaceById: (spaces: SpaceApiResponse[], spaceId: number): SpaceApiResponse | null => {

        for (const space of spaces) {
            if (space.id === spaceId) return space

            const found = SpaceTreeHelper.findSpaceById(space.childSpaces, spaceId)
            if (found) return found
        }

        return null
    },

    updateSpaceById: (
        spaces: SpaceApiResponse[],
        spaceId: number,
        updater: (space: SpaceApiResponse) => SpaceApiResponse,
    ): SpaceApiResponse[] => spaces.map(space => {

        if (space.id === spaceId) return updater(space)
        return { ...space, childSpaces: SpaceTreeHelper.updateSpaceById(space.childSpaces, spaceId, updater) }
    }),

    removeSpaceById: (spaces: SpaceApiResponse[], spaceId: number): SpaceApiResponse[] => spaces
        .filter(space => space.id !== spaceId)
        .map(space => ({ ...space, childSpaces: SpaceTreeHelper.removeSpaceById(space.childSpaces, spaceId) })),

    mapAllSpaces: (
        spaces: SpaceApiResponse[],
        transform: (space: SpaceApiResponse) => SpaceApiResponse,
    ): SpaceApiResponse[] => spaces.map(space => transform({
        ...space,
        childSpaces: SpaceTreeHelper.mapAllSpaces(space.childSpaces, transform),
    })),

    countAllSpaces: (spaces: SpaceApiResponse[]): number => spaces.reduce(
        (sum, space) => sum + 1 + SpaceTreeHelper.countAllSpaces(space.childSpaces),
        0,
    ),

    countAllPokemon: (spaces: SpaceApiResponse[]): number => spaces.reduce(
        (sum, space) => sum + space.pokemon.length + SpaceTreeHelper.countAllPokemon(space.childSpaces),
        0,
    ),

    getAllPokemonWithSpace: (spaces: SpaceApiResponse[]): PokemonWithSpace[] => spaces.reduce(
        (entries: PokemonWithSpace[], space) => [
            ...entries,
            ...space.pokemon.map(pokemon => ({ pokemon, space })),
            ...SpaceTreeHelper.getAllPokemonWithSpace(space.childSpaces),
        ],
        [],
    ),
})
