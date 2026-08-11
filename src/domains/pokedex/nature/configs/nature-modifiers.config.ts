import { StatEnum } from "../../../pokemon-management/pokemon/enums/stat.enum"
import { NatureEnum } from "../enums/nature.enum"


export interface NatureModifier {
    readonly increased: StatEnum | null
    readonly decreased: StatEnum | null
}


export const NatureModifiersConfig: Readonly<Record<NatureEnum, NatureModifier>> = Object.freeze({
    [NatureEnum.HARDY]: { increased: null, decreased: null },
    [NatureEnum.LONELY]: { increased: StatEnum.ATTACK, decreased: StatEnum.DEFENSE },
    [NatureEnum.BRAVE]: { increased: StatEnum.ATTACK, decreased: StatEnum.SPEED },
    [NatureEnum.ADAMANT]: { increased: StatEnum.ATTACK, decreased: StatEnum.SPECIAL_ATTACK },
    [NatureEnum.NAUGHTY]: { increased: StatEnum.ATTACK, decreased: StatEnum.SPECIAL_DEFENSE },
    [NatureEnum.BOLD]: { increased: StatEnum.DEFENSE, decreased: StatEnum.ATTACK },
    [NatureEnum.DOCILE]: { increased: null, decreased: null },
    [NatureEnum.RELAXED]: { increased: StatEnum.DEFENSE, decreased: StatEnum.SPEED },
    [NatureEnum.IMPISH]: { increased: StatEnum.DEFENSE, decreased: StatEnum.SPECIAL_ATTACK },
    [NatureEnum.LAX]: { increased: StatEnum.DEFENSE, decreased: StatEnum.SPECIAL_DEFENSE },
    [NatureEnum.TIMID]: { increased: StatEnum.SPEED, decreased: StatEnum.ATTACK },
    [NatureEnum.HASTY]: { increased: StatEnum.SPEED, decreased: StatEnum.DEFENSE },
    [NatureEnum.SERIOUS]: { increased: null, decreased: null },
    [NatureEnum.JOLLY]: { increased: StatEnum.SPEED, decreased: StatEnum.SPECIAL_ATTACK },
    [NatureEnum.NAIVE]: { increased: StatEnum.SPEED, decreased: StatEnum.SPECIAL_DEFENSE },
    [NatureEnum.MODEST]: { increased: StatEnum.SPECIAL_ATTACK, decreased: StatEnum.ATTACK },
    [NatureEnum.MILD]: { increased: StatEnum.SPECIAL_ATTACK, decreased: StatEnum.DEFENSE },
    [NatureEnum.QUIET]: { increased: StatEnum.SPECIAL_ATTACK, decreased: StatEnum.SPEED },
    [NatureEnum.BASHFUL]: { increased: null, decreased: null },
    [NatureEnum.RASH]: { increased: StatEnum.SPECIAL_ATTACK, decreased: StatEnum.SPECIAL_DEFENSE },
    [NatureEnum.CALM]: { increased: StatEnum.SPECIAL_DEFENSE, decreased: StatEnum.ATTACK },
    [NatureEnum.GENTLE]: { increased: StatEnum.SPECIAL_DEFENSE, decreased: StatEnum.DEFENSE },
    [NatureEnum.SASSY]: { increased: StatEnum.SPECIAL_DEFENSE, decreased: StatEnum.SPEED },
    [NatureEnum.CAREFUL]: { increased: StatEnum.SPECIAL_DEFENSE, decreased: StatEnum.SPECIAL_ATTACK },
    [NatureEnum.QUIRKY]: { increased: null, decreased: null },
})
