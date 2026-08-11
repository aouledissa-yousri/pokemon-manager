interface _PokeApiCacheHelper {
    readonly getOrFetch: <T>(key: string, fetcher: () => Promise<T>) => Promise<T>
}

const globalCache = globalThis as unknown as { __pokeApiCache?: Map<string, unknown> }

export const PokeApiCacheHelper: _PokeApiCacheHelper = Object.freeze({

    getOrFetch: async <T>(key: string, fetcher: () => Promise<T>) => {

        if (!globalCache.__pokeApiCache) globalCache.__pokeApiCache = new Map()
        const cache = globalCache.__pokeApiCache

        if (cache.has(key)) return cache.get(key) as T

        const value = await fetcher()
        cache.set(key, value)
        return value
    },
})
