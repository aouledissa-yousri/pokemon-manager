export interface ItemAutocompleteComponentProps {
    readonly value: string | null
    readonly onChange: (item: string | null) => void
    readonly label?: string
}
