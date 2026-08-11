import { PokeApiFetchHelper } from "../../shared/helpers/pokeapi-fetch.helper"


interface _MoveMetadataHelper {
    readonly buildMoveNameMap: (groupListUrl: string, groupDetailBaseUrl: string) => Promise<Map<string, string>>
}

export const MoveMetadataHelper: _MoveMetadataHelper = Object.freeze({

    // Maps every move name to its group (a type name, or a damage-class name) by
    // fanning out over the group list — far cheaper than fetching ~900 move details.
    buildMoveNameMap: async (groupListUrl: string, groupDetailBaseUrl: string) => {

        const groupList = await PokeApiFetchHelper.fetchJson(groupListUrl)
        const groupNames = (groupList.results as { name: string }[]).map(entry => entry.name)

        const moveNameMap = new Map<string, string>()

        await Promise.all(groupNames.map(async groupName => {
            const groupDetail = await PokeApiFetchHelper.fetchJson(`${groupDetailBaseUrl}/${groupName}`)
            for (const move of (groupDetail.moves ?? []) as { name: string }[]) {
                moveNameMap.set(move.name, groupName)
            }
        }))

        return moveNameMap
    },
})
