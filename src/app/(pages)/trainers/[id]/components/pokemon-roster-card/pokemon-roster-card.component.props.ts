import { PokemonApiResponse } from "@/src/domains/pokemon-management/pokemon/DTOs/api-responses/pokemon.api-response"


export interface PokemonRosterCardComponentProps {
    readonly pokemon: PokemonApiResponse
    readonly onEdit?: () => void
    readonly onCopy?: () => void
    readonly onRemove?: () => void
    readonly onToggleShiny: () => void
}
