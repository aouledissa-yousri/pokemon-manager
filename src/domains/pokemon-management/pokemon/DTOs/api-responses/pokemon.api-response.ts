import { NatureEnum } from "../../../../pokedex/nature/enums/nature.enum"
import { PokemonMovesetApiResponse } from "./pokemon-moveset.api-response"
import { PokemonStatSpreadApiResponse } from "./pokemon-stat-spread.api-response"


export interface PokemonApiResponse {
    readonly id: number
    readonly spaceId: number
    readonly speciesId: number
    readonly speciesName: string
    readonly level: number
    readonly nature: NatureEnum
    readonly ability: string
    readonly heldItem: string
    readonly isShiny: boolean
    readonly moves: PokemonMovesetApiResponse
    readonly ivs: PokemonStatSpreadApiResponse
    readonly evs: PokemonStatSpreadApiResponse
    readonly createdAt: string
}
