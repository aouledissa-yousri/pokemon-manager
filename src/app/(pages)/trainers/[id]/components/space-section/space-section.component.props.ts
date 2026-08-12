import { SpaceApiResponse } from "@/src/domains/trainer-management/space/DTOs/api-responses/space.api-response"
import { PokemonApiResponse } from "@/src/domains/pokemon-management/pokemon/DTOs/api-responses/pokemon.api-response"


export interface SpaceSectionComponentProps {
    readonly space: SpaceApiResponse
    readonly onAddPokemon: (space: SpaceApiResponse) => void
    readonly onAddChildSpace: (space: SpaceApiResponse) => void
    readonly onEditSpace: (space: SpaceApiResponse) => void
    readonly onRemoveSpace: (space: SpaceApiResponse) => void
    readonly onEditPokemon: (pokemon: PokemonApiResponse) => void
    readonly onCopyPokemon: (pokemon: PokemonApiResponse) => void
    readonly onRemovePokemon: (pokemon: PokemonApiResponse) => void
    readonly onToggleShiny: (pokemon: PokemonApiResponse) => void
}
