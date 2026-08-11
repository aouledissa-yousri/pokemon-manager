import { create } from "zustand"

import { SpaceApiResponse } from "@/src/domains/trainer-management/space/DTOs/api-responses/space.api-response"


interface EditSpaceDialogComponentStore {
    open: boolean
    space: SpaceApiResponse | null
    openDialog: (space: SpaceApiResponse) => void
    closeDialog: () => void
}


export const useEditSpaceDialogStore = create<EditSpaceDialogComponentStore>((set) => ({
    open: false,
    space: null,
    openDialog: (space) => set({ open: true, space }),
    closeDialog: () => set({ open: false, space: null }),
}))
