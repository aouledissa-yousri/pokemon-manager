import { create } from "zustand"


interface AddSpaceDialogComponentStore {
    open: boolean
    trainerId: number | null
    openDialog: (trainerId: number) => void
    closeDialog: () => void
}


export const useAddSpaceDialogStore = create<AddSpaceDialogComponentStore>((set) => ({
    open: false,
    trainerId: null,
    openDialog: (trainerId) => set({ open: true, trainerId }),
    closeDialog: () => set({ open: false, trainerId: null }),
}))
