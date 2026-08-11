import { NatureEnum } from "../../../pokedex/nature/enums/nature.enum"
import { NatureModifiersConfig } from "../../../pokedex/nature/configs/nature-modifiers.config"
import { StatEnum } from "../enums/stat.enum"


export interface StatValues {
    readonly hp: number
    readonly attack: number
    readonly defense: number
    readonly specialAttack: number
    readonly specialDefense: number
    readonly speed: number
}

export interface CalculatedStats extends StatValues {
    readonly total: number
}


interface _StatCalculatorHelper {
    readonly calculateHp: (base: number, iv: number, ev: number, level: number) => number
    readonly calculateStat: (base: number, iv: number, ev: number, level: number, natureModifier: number) => number
    readonly getNatureModifier: (nature: NatureEnum, stat: StatEnum) => number
    readonly calculateAllStats: (baseStats: StatValues, ivs: StatValues, evs: StatValues, level: number, nature: NatureEnum) => CalculatedStats
    readonly getBaseStatTotal: (baseStats: StatValues) => number
}


export const StatCalculatorHelper: _StatCalculatorHelper = Object.freeze({

    calculateHp: (base: number, iv: number, ev: number, level: number) =>
        Math.floor((2 * base + iv + Math.floor(ev / 4)) * level / 100) + level + 10,

    calculateStat: (base: number, iv: number, ev: number, level: number, natureModifier: number) =>
        Math.floor((Math.floor((2 * base + iv + Math.floor(ev / 4)) * level / 100) + 5) * natureModifier),

    getNatureModifier: (nature: NatureEnum, stat: StatEnum) => {

        const modifier = NatureModifiersConfig[nature]

        if (modifier.increased === stat) return 1.1
        if (modifier.decreased === stat) return 0.9
        return 1
    },

    calculateAllStats: (baseStats: StatValues, ivs: StatValues, evs: StatValues, level: number, nature: NatureEnum) => {

        const hp = StatCalculatorHelper.calculateHp(baseStats.hp, ivs.hp, evs.hp, level)

        const attack = StatCalculatorHelper.calculateStat(
            baseStats.attack, ivs.attack, evs.attack, level,
            StatCalculatorHelper.getNatureModifier(nature, StatEnum.ATTACK),
        )
        const defense = StatCalculatorHelper.calculateStat(
            baseStats.defense, ivs.defense, evs.defense, level,
            StatCalculatorHelper.getNatureModifier(nature, StatEnum.DEFENSE),
        )
        const specialAttack = StatCalculatorHelper.calculateStat(
            baseStats.specialAttack, ivs.specialAttack, evs.specialAttack, level,
            StatCalculatorHelper.getNatureModifier(nature, StatEnum.SPECIAL_ATTACK),
        )
        const specialDefense = StatCalculatorHelper.calculateStat(
            baseStats.specialDefense, ivs.specialDefense, evs.specialDefense, level,
            StatCalculatorHelper.getNatureModifier(nature, StatEnum.SPECIAL_DEFENSE),
        )
        const speed = StatCalculatorHelper.calculateStat(
            baseStats.speed, ivs.speed, evs.speed, level,
            StatCalculatorHelper.getNatureModifier(nature, StatEnum.SPEED),
        )

        return {
            hp,
            attack,
            defense,
            specialAttack,
            specialDefense,
            speed,
            total: hp + attack + defense + specialAttack + specialDefense + speed,
        }
    },

    getBaseStatTotal: (baseStats: StatValues) =>
        baseStats.hp + baseStats.attack + baseStats.defense +
        baseStats.specialAttack + baseStats.specialDefense + baseStats.speed,
})
