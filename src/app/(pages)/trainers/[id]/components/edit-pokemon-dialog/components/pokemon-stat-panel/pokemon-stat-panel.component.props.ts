import { SpeciesBaseStatsApiResponse } from "@/src/domains/pokedex/species/DTOs/api-responses/species-base-stats.api-response"
import { NatureEnum } from "@/src/domains/pokedex/nature/enums/nature.enum"
import { StatEnum } from "@/src/domains/pokemon-management/pokemon/enums/stat.enum"
import { StatValues } from "@/src/domains/pokemon-management/pokemon/helpers/stat-calculator.helper"


export interface PokemonStatPanelComponentProps {
    readonly baseStats: SpeciesBaseStatsApiResponse | null
    readonly ivs: StatValues
    readonly evs: StatValues
    readonly level: number
    readonly nature: NatureEnum
    readonly onIvChange: (stat: StatEnum, value: number) => void
    readonly onEvChange: (stat: StatEnum, value: number) => void
}
