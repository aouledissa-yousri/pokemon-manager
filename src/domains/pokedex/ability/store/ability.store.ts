import { create } from "zustand"

import { abilityProxy } from "../proxies/ability.proxy"


interface AbilityStore {

    // State
    abilities: string[]
    isLoading: boolean

    // Actions
    loadAbilities: () => Promise<void>
}


export const useAbilityStore = create<AbilityStore>((set, get) => ({

    abilities: [],
    isLoading: false,

    loadAbilities: async () => {

        if (get().abilities.length > 0 || get().isLoading) return

        set({ isLoading: true })

        try {
            const response = await abilityProxy.findAbilityList()
            if (response.success && response.data) set({ abilities: response.data })
        } finally {
            set({ isLoading: false })
        }
    },
}))
