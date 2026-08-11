import { SpeciesSummaryApiResponse } from "../api-responses/species-summary.api-response"
import { SpeciesDetailApiResponse } from "../api-responses/species-detail.api-response"


interface PokeApiListEntry {
    readonly name: string
    readonly url: string
}

interface PokeApiArtwork {
    readonly front_default?: string | null
    readonly front_shiny?: string | null
}

interface PokeApiPokemonPayload {
    readonly id: number
    readonly name: string
    readonly stats?: { readonly base_stat?: number, readonly stat?: { readonly name?: string } }[]
    readonly types?: { readonly type?: { readonly name?: string } }[]
    readonly abilities?: { readonly ability?: { readonly name?: string } }[]
    readonly sprites?: PokeApiArtwork & { readonly other?: Record<string, PokeApiArtwork> }
}


interface _SpeciesMapper {
    readonly mapToSummary: (entry: PokeApiListEntry) => SpeciesSummaryApiResponse
    readonly mapToDetail: (payload: PokeApiPokemonPayload) => SpeciesDetailApiResponse
}

export const SpeciesMapper: _SpeciesMapper = Object.freeze({

    mapToSummary: (entry: PokeApiListEntry) => ({
        id: Number.parseInt(entry.url.split("/").filter(Boolean).pop() ?? "0", 10),
        name: entry.name,
    }),

    mapToDetail: (payload: PokeApiPokemonPayload) => {

        const findBaseStat = (statName: string): number =>
            payload.stats?.find(entry => entry.stat?.name === statName)?.base_stat ?? 0

        const officialArtwork = payload.sprites?.other?.["official-artwork"]

        return {
            id: payload.id,
            name: payload.name,
            types: (payload.types ?? [])
                .map(entry => entry.type?.name)
                .filter((name): name is string => !!name),
            baseStats: {
                hp: findBaseStat("hp"),
                attack: findBaseStat("attack"),
                defense: findBaseStat("defense"),
                specialAttack: findBaseStat("special-attack"),
                specialDefense: findBaseStat("special-defense"),
                speed: findBaseStat("speed"),
            },
            artworkUrl: officialArtwork?.front_default ?? payload.sprites?.front_default ?? null,
            shinyArtworkUrl: officialArtwork?.front_shiny ?? payload.sprites?.front_shiny ?? null,
            abilities: (payload.abilities ?? [])
                .map(entry => entry.ability?.name)
                .filter((name): name is string => !!name),
        }
    },
})
