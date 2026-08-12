import { PokemonWithSpace } from "@/src/domains/trainer-management/space/helpers/space-tree.helper"


export interface TeamPokemonPickerComponentProps {
    readonly entries: PokemonWithSpace[]
    readonly selectedIds: number[]
    readonly maxTeamSize: number
    readonly onToggle: (pokemonId: number) => void
}
