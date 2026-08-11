import { create } from "zustand"


interface AddTrainerDialogComponentStore {
    open: boolean
    openDialog: () => void
    closeDialog: () => void
}


export const useAddTrainerDialogStore = create<AddTrainerDialogComponentStore>((set) => ({
    open: false,
    openDialog: () => set({ open: true }),
    closeDialog: () => set({ open: false }),
}))
