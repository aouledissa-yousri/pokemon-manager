import { SpaceApiResponse } from "../DTOs/api-responses/space.api-response"
import { NameFormatHelper } from "../../../pokedex/shared/helpers/name-format.helper"


interface _SpaceDisplayHelper {
    readonly getDisplayName: (space: SpaceApiResponse) => string
}

export const SpaceDisplayHelper: _SpaceDisplayHelper = Object.freeze({

    getDisplayName: (space: SpaceApiResponse) => {

        if (space.name) return space.name

        const firstPokemon = space.pokemon[0]
        if (firstPokemon) return NameFormatHelper.prettify(firstPokemon.speciesName)

        return "Empty Space"
    },
})
