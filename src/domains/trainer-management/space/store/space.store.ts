import { create } from "zustand"

import { SpaceApiResponse } from "../DTOs/api-responses/space.api-response"
import { SpaceTreeHelper } from "../helpers/space-tree.helper"
import { PokemonApiResponse } from "../../../pokemon-management/pokemon/DTOs/api-responses/pokemon.api-response"


interface SpaceStore {

    // State
    trainerId: number | null
    spaces: SpaceApiResponse[]
    isLoading: boolean
    error: string | null

    // Actions
    setSpaces: (trainerId: number, spaces: SpaceApiResponse[]) => void
    upsertSpace: (space: SpaceApiResponse) => void
    removeSpace: (spaceId: number) => void
    reorderSpaces: (parentSpaceId: number | null, orderedIds: number[]) => void
    upsertPokemon: (pokemon: PokemonApiResponse) => void
    removePokemon: (pokemonId: number) => void
    reorderPokemon: (spaceId: number, orderedIds: number[]) => void
    setError: (error: string | null) => void
    clearStore: () => void
}


export const useSpaceStore = create<SpaceStore>((set) => ({

    trainerId: null,
    spaces: [],
    isLoading: true,
    error: null,

    setSpaces: (trainerId, spaces) => set({ trainerId, spaces, isLoading: false, error: null }),

    upsertSpace: (space) => set(state => {

        const existing = SpaceTreeHelper.findSpaceById(state.spaces, space.id)

        if (existing) {
            return {
                spaces: SpaceTreeHelper.updateSpaceById(state.spaces, space.id, () => ({
                    ...space,
                    pokemon: existing.pokemon,
                    childSpaces: existing.childSpaces,
                })),
            }
        }

        const newSpace: SpaceApiResponse = { ...space, pokemon: [], childSpaces: [] }

        if (space.parentSpaceId === null) return { spaces: [...state.spaces, newSpace] }

        return {
            spaces: SpaceTreeHelper.updateSpaceById(state.spaces, space.parentSpaceId, parent => ({
                ...parent,
                childSpaces: [...parent.childSpaces, newSpace],
            })),
        }
    }),

    removeSpace: (spaceId) => set(state => ({
        spaces: SpaceTreeHelper.removeSpaceById(state.spaces, spaceId),
    })),

    reorderSpaces: (parentSpaceId, orderedIds) => set(state => {

        if (parentSpaceId === null) {
            const byId = new Map(state.spaces.map(space => [space.id, space]))
            return { spaces: orderedIds.map(id => byId.get(id)).filter((space): space is SpaceApiResponse => !!space) }
        }

        return {
            spaces: SpaceTreeHelper.updateSpaceById(state.spaces, parentSpaceId, parent => {
                const byId = new Map(parent.childSpaces.map(space => [space.id, space]))
                return {
                    ...parent,
                    childSpaces: orderedIds.map(id => byId.get(id)).filter((space): space is SpaceApiResponse => !!space),
                }
            }),
        }
    }),

    upsertPokemon: (pokemon) => set(state => ({
        spaces: SpaceTreeHelper.updateSpaceById(state.spaces, pokemon.spaceId, space => {
            const exists = space.pokemon.some(entry => entry.id === pokemon.id)
            return {
                ...space,
                pokemon: exists
                    ? space.pokemon.map(entry => entry.id === pokemon.id ? pokemon : entry)
                    : [...space.pokemon, pokemon],
            }
        }),
    })),

    removePokemon: (pokemonId) => set(state => ({
        spaces: SpaceTreeHelper.mapAllSpaces(state.spaces, space => ({
            ...space,
            pokemon: space.pokemon.filter(pokemon => pokemon.id !== pokemonId),
        })),
    })),

    reorderPokemon: (spaceId, orderedIds) => set(state => ({
        spaces: SpaceTreeHelper.updateSpaceById(state.spaces, spaceId, space => {
            const byId = new Map(space.pokemon.map(pokemon => [pokemon.id, pokemon]))
            return {
                ...space,
                pokemon: orderedIds.map(id => byId.get(id)).filter((pokemon): pokemon is PokemonApiResponse => !!pokemon),
            }
        }),
    })),

    setError: (error) => set({ error, isLoading: false }),
    clearStore: () => set({ trainerId: null, spaces: [], isLoading: true, error: null }),
}))
