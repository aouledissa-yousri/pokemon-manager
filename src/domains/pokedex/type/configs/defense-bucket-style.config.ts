import { DefenseBucketEnum } from "../enums/defense-bucket.enum"


export interface DefenseBucketStyle {
    readonly label: string
    readonly color: string
}

export const DefenseBucketStyleConfig: Readonly<Record<DefenseBucketEnum, DefenseBucketStyle>> = Object.freeze({
    [DefenseBucketEnum.IMMUNE]: { label: "Immune", color: "#8B5CF6" },
    [DefenseBucketEnum.QUARTER_RESIST]: { label: "0.25x Resist", color: "#15803D" },
    [DefenseBucketEnum.HALF_RESIST]: { label: "0.5x Resist", color: "#22C55E" },
    [DefenseBucketEnum.NEUTRAL]: { label: "Neutral", color: "#9AA0A6" },
    [DefenseBucketEnum.DOUBLE_WEAK]: { label: "2x Weak", color: "#F59E0B" },
    [DefenseBucketEnum.QUADRUPLE_WEAK]: { label: "4x Weak", color: "#EF4444" },
})

export const DEFENSE_BUCKET_ORDER: readonly DefenseBucketEnum[] = Object.freeze([
    DefenseBucketEnum.IMMUNE,
    DefenseBucketEnum.QUARTER_RESIST,
    DefenseBucketEnum.HALF_RESIST,
    DefenseBucketEnum.NEUTRAL,
    DefenseBucketEnum.DOUBLE_WEAK,
    DefenseBucketEnum.QUADRUPLE_WEAK,
])
