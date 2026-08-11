import { create } from "zustand"

import { SpaceApiResponse } from "../DTOs/api-responses/space.api-response"
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
    reorderSpaces: (orderedIds: number[]) => void
    removeSpace: (spaceId: number) => void
    upsertPokemon: (pokemon: PokemonApiResponse) => void
    removePokemon: (pokemonId: number) => void
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
        const exists = state.spaces.some(entry => entry.id === space.id)
        return {
            spaces: exists
                ? state.spaces.map(entry => entry.id === space.id ? { ...space, pokemon: entry.pokemon } : entry)
                : [...state.spaces, space],
        }
    }),

    reorderSpaces: (orderedIds) => set(state => {
        const byId = new Map(state.spaces.map(space => [space.id, space]))
        return { spaces: orderedIds.map(id => byId.get(id)).filter((space): space is SpaceApiResponse => !!space) }
    }),

    removeSpace: (spaceId) => set(state => ({
        spaces: state.spaces.filter(space => space.id !== spaceId),
    })),

    upsertPokemon: (pokemon) => set(state => ({
        spaces: state.spaces.map(space => {

            if (space.id !== pokemon.spaceId) return space

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
        spaces: state.spaces.map(space => ({
            ...space,
            pokemon: space.pokemon.filter(pokemon => pokemon.id !== pokemonId),
        })),
    })),

    setError: (error) => set({ error, isLoading: false }),
    clearStore: () => set({ trainerId: null, spaces: [], isLoading: true, error: null }),
}))
