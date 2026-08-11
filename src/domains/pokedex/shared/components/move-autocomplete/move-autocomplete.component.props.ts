export interface MoveAutocompleteComponentProps {
    readonly value: string | null
    readonly onChange: (move: string | null) => void
    readonly label?: string
}
