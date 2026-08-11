import { create } from "zustand"

import { PokemonApiResponse } from "@/src/domains/pokemon-management/pokemon/DTOs/api-responses/pokemon.api-response"


interface EditPokemonDialogComponentStore {
    open: boolean
    pokemon: PokemonApiResponse | null
    openDialog: (pokemon: PokemonApiResponse) => void
    closeDialog: () => void
}


export const useEditPokemonDialogStore = create<EditPokemonDialogComponentStore>((set) => ({
    open: false,
    pokemon: null,
    openDialog: (pokemon) => set({ open: true, pokemon }),
    closeDialog: () => set({ open: false, pokemon: null }),
}))
