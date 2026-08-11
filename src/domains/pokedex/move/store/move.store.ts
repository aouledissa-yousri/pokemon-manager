import { create } from "zustand"

import { moveProxy } from "../proxies/move.proxy"
import { MoveApiResponse } from "../DTOs/api-responses/move.api-response"


interface MoveStore {

    // State
    moves: MoveApiResponse[]
    isLoading: boolean

    // Actions
    loadMoves: () => Promise<void>
}


export const useMoveStore = create<MoveStore>((set, get) => ({

    moves: [],
    isLoading: false,

    loadMoves: async () => {

        if (get().moves.length > 0 || get().isLoading) return

        set({ isLoading: true })

        try {
            const response = await moveProxy.findMoveList()
            if (response.success && response.data) set({ moves: response.data })
        } finally {
            set({ isLoading: false })
        }
    },
}))
