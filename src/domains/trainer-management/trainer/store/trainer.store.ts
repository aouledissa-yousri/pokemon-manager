import { create } from "zustand"

import { TrainerApiResponse } from "../DTOs/api-responses/trainer.api-response"


interface TrainerStore {

    // State
    trainers: TrainerApiResponse[]
    isLoading: boolean
    error: string | null

    // Actions
    setTrainers: (trainers: TrainerApiResponse[]) => void
    setIsLoading: (isLoading: boolean) => void
    setError: (error: string | null) => void
}


export const useTrainerStore = create<TrainerStore>((set) => ({

    trainers: [],
    isLoading: true,
    error: null,

    setTrainers: (trainers) => set({ trainers, isLoading: false, error: null }),
    setIsLoading: (isLoading) => set({ isLoading }),
    setError: (error) => set({ error, isLoading: false }),
}))
