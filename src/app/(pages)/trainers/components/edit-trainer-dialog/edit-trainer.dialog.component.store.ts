import { create } from "zustand"

import { TrainerApiResponse } from "@/src/domains/trainer-management/trainer/DTOs/api-responses/trainer.api-response"


interface EditTrainerDialogComponentStore {
    open: boolean
    trainer: TrainerApiResponse | null
    openDialog: (trainer: TrainerApiResponse) => void
    closeDialog: () => void
}


export const useEditTrainerDialogStore = create<EditTrainerDialogComponentStore>((set) => ({
    open: false,
    trainer: null,
    openDialog: (trainer) => set({ open: true, trainer }),
    closeDialog: () => set({ open: false, trainer: null }),
}))
