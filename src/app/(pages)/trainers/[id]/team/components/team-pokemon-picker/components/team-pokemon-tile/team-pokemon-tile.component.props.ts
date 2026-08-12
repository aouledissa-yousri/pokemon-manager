import { PokemonApiResponse } from "@/src/domains/pokemon-management/pokemon/DTOs/api-responses/pokemon.api-response"


export interface TeamPokemonTileComponentProps {
    readonly pokemon: PokemonApiResponse
    readonly spaceName: string
    readonly isSelected: boolean
    readonly isDisabled: boolean
    readonly onToggle: () => void
}
