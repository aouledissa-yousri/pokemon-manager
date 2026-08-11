import { StatEnum } from "../enums/stat.enum"


export interface StatLabel {
    readonly label: string
    readonly shortLabel: string
}


export const StatLabelsConfig: Readonly<Record<StatEnum, StatLabel>> = Object.freeze({
    [StatEnum.HP]: { label: "HP", shortLabel: "HP" },
    [StatEnum.ATTACK]: { label: "Attack", shortLabel: "Atk" },
    [StatEnum.DEFENSE]: { label: "Defense", shortLabel: "Def" },
    [StatEnum.SPECIAL_ATTACK]: { label: "Sp. Atk", shortLabel: "SpA" },
    [StatEnum.SPECIAL_DEFENSE]: { label: "Sp. Def", shortLabel: "SpD" },
    [StatEnum.SPEED]: { label: "Speed", shortLabel: "Spe" },
})

export const STAT_ORDER: readonly StatEnum[] = Object.freeze([
    StatEnum.HP,
    StatEnum.ATTACK,
    StatEnum.DEFENSE,
    StatEnum.SPECIAL_ATTACK,
    StatEnum.SPECIAL_DEFENSE,
    StatEnum.SPEED,
])
