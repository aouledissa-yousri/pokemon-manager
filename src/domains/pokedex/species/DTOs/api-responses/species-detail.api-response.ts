import { SpeciesBaseStatsApiResponse } from "./species-base-stats.api-response"


export interface SpeciesDetailApiResponse {
    readonly id: number
    readonly name: string
    readonly types: string[]
    readonly baseStats: SpeciesBaseStatsApiResponse
    readonly artworkUrl: string | null
    readonly shinyArtworkUrl: string | null
    readonly abilities: string[]
}
