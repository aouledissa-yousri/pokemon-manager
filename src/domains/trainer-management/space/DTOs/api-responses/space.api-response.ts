import { PokemonApiResponse } from "../../../../pokemon-management/pokemon/DTOs/api-responses/pokemon.api-response"


export interface SpaceApiResponse {
    readonly id: number
    readonly trainerId: number
    readonly parentSpaceId: number | null
    readonly name: string
    readonly metLocation: string
    readonly pokemon: PokemonApiResponse[]
    readonly childSpaces: SpaceApiResponse[]
    readonly createdAt: string
}
