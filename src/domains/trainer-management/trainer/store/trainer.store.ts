import { create } from "zustand"

import { TrainerApiResponse } from "../DTOs/api-responses/trainer.api-response"


interface TrainerStore {

    // State
    trainers: TrainerApiResponse[]
    isLoading: boolean
    error: string | null

    // Actions
    setTrainers: (trainers: TrainerApiResponse[]) => void
    reorderTrainers: (orderedIds: number[]) => void
    setIsLoading: (isLoading: boolean) => void
    setError: (error: string | null) => void
}


export const useTrainerStore = create<TrainerStore>((set) => ({

    trainers: [],
    isLoading: true,
    error: null,

    setTrainers: (trainers) => set({ trainers, isLoading: false, error: null }),

    reorderTrainers: (orderedIds) => set(state => {
        const byId = new Map(state.trainers.map(trainer => [trainer.id, trainer]))
        return { trainers: orderedIds.map(id => byId.get(id)).filter((trainer): trainer is TrainerApiResponse => !!trainer) }
    }),

    setIsLoading: (isLoading) => set({ isLoading }),
    setError: (error) => set({ error, isLoading: false }),
}))
