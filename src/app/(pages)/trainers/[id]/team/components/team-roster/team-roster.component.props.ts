import { PokemonApiResponse } from "@/src/domains/pokemon-management/pokemon/DTOs/api-responses/pokemon.api-response"


export interface TeamRosterComponentProps {
    readonly pokemonList: PokemonApiResponse[]
    readonly onToggleShiny: (pokemon: PokemonApiResponse) => void
}
