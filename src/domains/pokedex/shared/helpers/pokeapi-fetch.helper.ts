interface _PokeApiFetchHelper {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- raw PokeAPI payloads are untyped at this boundary
    readonly fetchJson: (url: string) => Promise<any>
}

export const PokeApiFetchHelper: _PokeApiFetchHelper = Object.freeze({

    fetchJson: async (url: string) => {
        const response = await fetch(url)
        if (!response.ok) throw new Error(`PokeAPI request failed: ${url}`)
        return response.json()
    },
})
