import { SpeciesSummaryApiResponse } from "../../../species/DTOs/api-responses/species-summary.api-response"


export interface SpeciesAutocompleteComponentProps {
    readonly value: SpeciesSummaryApiResponse | null
    readonly onChange: (species: SpeciesSummaryApiResponse | null) => void
    readonly label?: string
    readonly autoFocus?: boolean
}
