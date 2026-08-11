import { create } from "zustand"

import { PokemonApiResponse } from "@/src/domains/pokemon-management/pokemon/DTOs/api-responses/pokemon.api-response"


interface CopyPokemonDialogComponentStore {
    open: boolean
    pokemon: PokemonApiResponse | null
    openDialog: (pokemon: PokemonApiResponse) => void
    closeDialog: () => void
}


export const useCopyPokemonDialogStore = create<CopyPokemonDialogComponentStore>((set) => ({
    open: false,
    pokemon: null,
    openDialog: (pokemon) => set({ open: true, pokemon }),
    closeDialog: () => set({ open: false, pokemon: null }),
}))
