import { create } from "zustand"


interface AddSpaceDialogComponentStore {
    open: boolean
    trainerId: number | null
    parentSpaceId: number | null
    openDialog: (trainerId: number, parentSpaceId?: number | null) => void
    closeDialog: () => void
}


export const useAddSpaceDialogStore = create<AddSpaceDialogComponentStore>((set) => ({
    open: false,
    trainerId: null,
    parentSpaceId: null,
    openDialog: (trainerId, parentSpaceId = null) => set({ open: true, trainerId, parentSpaceId }),
    closeDialog: () => set({ open: false, trainerId: null, parentSpaceId: null }),
}))
