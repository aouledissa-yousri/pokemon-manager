import { create } from "zustand"

import { itemProxy } from "../proxies/item.proxy"


interface ItemStore {

    // State
    items: string[]
    isLoading: boolean

    // Actions
    loadItems: () => Promise<void>
}


export const useItemStore = create<ItemStore>((set, get) => ({

    items: [],
    isLoading: false,

    loadItems: async () => {

        if (get().items.length > 0 || get().isLoading) return

        set({ isLoading: true })

        try {
            const response = await itemProxy.findItemList()
            if (response.success && response.data) set({ items: response.data })
        } finally {
            set({ isLoading: false })
        }
    },
}))
