import { TypeColorsConfig } from "../configs/type-colors.config"
import { TypeEffectivenessConfig } from "../configs/type-effectiveness.config"
import { DefenseBucketEnum } from "../enums/defense-bucket.enum"


const ALL_TYPES: readonly string[] = Object.freeze(Object.keys(TypeColorsConfig))


interface _TypeEffectivenessHelper {
    readonly getMultiplier: (attackingType: string, defendingTypes: string[]) => number
    readonly getBucketForMultiplier: (multiplier: number) => DefenseBucketEnum
    readonly getDefenseBuckets: (defendingTypes: string[]) => Readonly<Record<DefenseBucketEnum, string[]>>
}

export const TypeEffectivenessHelper: _TypeEffectivenessHelper = Object.freeze({

    getMultiplier: (attackingType: string, defendingTypes: string[]) => defendingTypes.reduce(
        (product, defendingType) => product * (TypeEffectivenessConfig[attackingType]?.[defendingType] ?? 1),
        1,
    ),

    getBucketForMultiplier: (multiplier: number) => {

        if (multiplier === 0) return DefenseBucketEnum.IMMUNE
        if (multiplier === 0.25) return DefenseBucketEnum.QUARTER_RESIST
        if (multiplier === 0.5) return DefenseBucketEnum.HALF_RESIST
        if (multiplier === 2) return DefenseBucketEnum.DOUBLE_WEAK
        if (multiplier === 4) return DefenseBucketEnum.QUADRUPLE_WEAK
        return DefenseBucketEnum.NEUTRAL
    },

    getDefenseBuckets: (defendingTypes: string[]) => {

        const buckets: Record<DefenseBucketEnum, string[]> = {
            [DefenseBucketEnum.IMMUNE]: [],
            [DefenseBucketEnum.QUARTER_RESIST]: [],
            [DefenseBucketEnum.HALF_RESIST]: [],
            [DefenseBucketEnum.NEUTRAL]: [],
            [DefenseBucketEnum.DOUBLE_WEAK]: [],
            [DefenseBucketEnum.QUADRUPLE_WEAK]: [],
        }

        for (const attackingType of ALL_TYPES) {
            const multiplier = TypeEffectivenessHelper.getMultiplier(attackingType, defendingTypes)
            buckets[TypeEffectivenessHelper.getBucketForMultiplier(multiplier)].push(attackingType)
        }

        return buckets
    },
})
