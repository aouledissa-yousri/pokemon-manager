export interface PokemonArtworkComponentProps {
    readonly speciesName: string
    readonly artworkUrl: string | null
    readonly shinyArtworkUrl: string | null
    readonly isShiny: boolean
    readonly types: string[]
    readonly onToggleShiny: (isShiny: boolean) => void
}
