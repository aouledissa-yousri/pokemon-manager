export interface AbilityAutocompleteComponentProps {
    readonly value: string | null
    readonly onChange: (ability: string | null) => void
    readonly label?: string
}
