import { create } from "zustand"

import { speciesProxy } from "../proxies/species.proxy"
import { SpeciesSummaryApiResponse } from "../DTOs/api-responses/species-summary.api-response"
import { SpeciesDetailApiResponse } from "../DTOs/api-responses/species-detail.api-response"


interface SpeciesStore {

    // State
    speciesList: SpeciesSummaryApiResponse[]
    speciesDetails: Record<number, SpeciesDetailApiResponse>
    isLoadingList: boolean

    // Actions
    loadSpeciesList: () => Promise<void>
    loadSpeciesDetail: (speciesId: number) => Promise<SpeciesDetailApiResponse | null>
}


export const useSpeciesStore = create<SpeciesStore>((set, get) => ({

    speciesList: [],
    speciesDetails: {},
    isLoadingList: false,

    loadSpeciesList: async () => {

        if (get().speciesList.length > 0 || get().isLoadingList) return

        set({ isLoadingList: true })

        try {
            const response = await speciesProxy.findSpeciesList()
            if (response.success && response.data) set({ speciesList: response.data })
        } finally {
            set({ isLoadingList: false })
        }
    },

    loadSpeciesDetail: async (speciesId: number) => {

        const cached = get().speciesDetails[speciesId]
        if (cached) return cached

        try {
            const response = await speciesProxy.findSpeciesDetail(speciesId)

            if (response.success && response.data) {
                const detail = response.data
                set(state => ({ speciesDetails: { ...state.speciesDetails, [speciesId]: detail } }))
                return detail
            }
        } catch {
            // swallow — caller renders a fallback
        }

        return null
    },
}))
