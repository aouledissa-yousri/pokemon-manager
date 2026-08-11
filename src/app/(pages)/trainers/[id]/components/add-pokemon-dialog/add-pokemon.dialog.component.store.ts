import { create } from "zustand"


interface AddPokemonDialogComponentStore {
    open: boolean
    spaceId: number | null
    openDialog: (spaceId: number) => void
    closeDialog: () => void
}


export const useAddPokemonDialogStore = create<AddPokemonDialogComponentStore>((set) => ({
    open: false,
    spaceId: null,
    openDialog: (spaceId) => set({ open: true, spaceId }),
    closeDialog: () => set({ open: false, spaceId: null }),
}))
