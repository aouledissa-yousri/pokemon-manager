import { create } from "zustand"

import { PokemonApiResponse } from "@/src/domains/pokemon-management/pokemon/DTOs/api-responses/pokemon.api-response"


interface PokepasteDialogComponentStore {
    open: boolean
    pokemonList: PokemonApiResponse[]
    openDialog: (pokemonList: PokemonApiResponse[]) => void
    closeDialog: () => void
}


export const usePokepasteDialogStore = create<PokepasteDialogComponentStore>((set) => ({
    open: false,
    pokemonList: [],
    openDialog: (pokemonList) => set({ open: true, pokemonList }),
    closeDialog: () => set({ open: false, pokemonList: [] }),
}))
