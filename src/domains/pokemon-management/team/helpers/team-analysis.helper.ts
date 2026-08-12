import { PokemonApiResponse } from "../../pokemon/DTOs/api-responses/pokemon.api-response"
import { MoveApiResponse } from "../../../pokedex/move/DTOs/api-responses/move.api-response"
import { TypeEffectivenessHelper } from "../../../pokedex/type/helpers/type-effectiveness.helper"
import { TypeColorsConfig } from "../../../pokedex/type/configs/type-colors.config"


export interface TeamMemberInput {
    readonly pokemon: PokemonApiResponse
    readonly types: string[]
}

export interface TeamTypeSegment {
    readonly type: string
    readonly count: number
    readonly percentage: number
}

export interface TeamTypeCoverageEntry {
    readonly type: string
    readonly isCovered: boolean
}

export interface TeamWeakness {
    readonly type: string
    readonly affectedCount: number
}

export interface TeamMoveDistribution {
    readonly physical: number
    readonly special: number
    readonly status: number
}


const ALL_TYPES: readonly string[] = Object.freeze(Object.keys(TypeColorsConfig))

function getTeamMoveNames(team: TeamMemberInput[]): string[] {
    return team.flatMap(member => member.pokemon.moves.filter((move): move is string => !!move))
}

function toSegments(counts: Map<string, number>): TeamTypeSegment[] {

    const total = Array.from(counts.values()).reduce((sum, count) => sum + count, 0)

    return Array.from(counts.entries())
        .map(([type, count]) => ({ type, count, percentage: total > 0 ? (count / total) * 100 : 0 }))
        .sort((a, b) => b.count - a.count)
}


interface _TeamAnalysisHelper {
    readonly getMoveTypeCoverage: (team: TeamMemberInput[], allMoves: MoveApiResponse[]) => TeamTypeSegment[]
    readonly getTypeCoverageChecklist: (team: TeamMemberInput[], allMoves: MoveApiResponse[]) => TeamTypeCoverageEntry[]
    readonly getSpeciesTypeDistribution: (team: TeamMemberInput[]) => TeamTypeSegment[]
    readonly getWeaknesses: (team: TeamMemberInput[]) => TeamWeakness[]
    readonly getMoveDistribution: (team: TeamMemberInput[], allMoves: MoveApiResponse[]) => TeamMoveDistribution
}

export const TeamAnalysisHelper: _TeamAnalysisHelper = Object.freeze({

    getMoveTypeCoverage: (team: TeamMemberInput[], allMoves: MoveApiResponse[]) => {

        const moveByName = new Map(allMoves.map(move => [move.name, move]))
        const counts = new Map<string, number>()

        getTeamMoveNames(team).forEach(moveName => {

            const move = moveByName.get(moveName)
            if (!move?.type) return
            if (move.damageClass !== "physical" && move.damageClass !== "special") return

            counts.set(move.type, (counts.get(move.type) ?? 0) + 1)
        })

        return toSegments(counts)
    },

    getTypeCoverageChecklist: (team: TeamMemberInput[], allMoves: MoveApiResponse[]) => {

        const moveByName = new Map(allMoves.map(move => [move.name, move]))

        const attackingTypes = getTeamMoveNames(team)
            .map(moveName => moveByName.get(moveName))
            .filter((move): move is MoveApiResponse =>
                !!move?.type && (move.damageClass === "physical" || move.damageClass === "special"))
            .map(move => move.type as string)

        return ALL_TYPES.map(type => ({
            type,
            isCovered: attackingTypes.some(attackingType => TypeEffectivenessHelper.getMultiplier(attackingType, [type]) > 1),
        }))
    },

    getSpeciesTypeDistribution: (team: TeamMemberInput[]) => {

        const counts = new Map<string, number>()

        team.forEach(member => member.types.forEach(type => {
            counts.set(type, (counts.get(type) ?? 0) + 1)
        }))

        return toSegments(counts)
    },

    getWeaknesses: (team: TeamMemberInput[]) => {

        return ALL_TYPES
            .map(attackingType => ({
                type: attackingType,
                affectedCount: team.filter(member => TypeEffectivenessHelper.getMultiplier(attackingType, member.types) > 1).length,
            }))
            .filter(weakness => weakness.affectedCount > 0)
            .sort((a, b) => b.affectedCount - a.affectedCount)
    },

    getMoveDistribution: (team: TeamMemberInput[], allMoves: MoveApiResponse[]) => {

        const moveByName = new Map(allMoves.map(move => [move.name, move]))

        return getTeamMoveNames(team).reduce(
            (distribution, moveName) => {

                const damageClass = moveByName.get(moveName)?.damageClass

                if (damageClass === "physical") return { ...distribution, physical: distribution.physical + 1 }
                if (damageClass === "special") return { ...distribution, special: distribution.special + 1 }
                if (damageClass === "status") return { ...distribution, status: distribution.status + 1 }
                return distribution
            },
            { physical: 0, special: 0, status: 0 },
        )
    },
})
