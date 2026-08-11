import { z } from "zod"

import { NatureEnum } from "../../../pokedex/nature/enums/nature.enum"
import { PokemonDefaultsConfig } from "../configs/pokemon-defaults.config"
import { IvSpreadValidationSchema, DEFAULT_IV_SPREAD } from "./iv-spread.validation-schema"
import { EvSpreadValidationSchema, DEFAULT_EV_SPREAD } from "./ev-spread.validation-schema"


const MoveSlotSchema = z.string().nullable().default(null)


export const EditPokemonBaseValidationSchema = z.object({
    level: z.number().int()
        .min(PokemonDefaultsConfig.MIN_LEVEL)
        .max(PokemonDefaultsConfig.MAX_LEVEL)
        .default(PokemonDefaultsConfig.DEFAULT_LEVEL),
    nature: z.enum(NatureEnum).default(NatureEnum.HARDY),
    ability: z.string().default(""),
    heldItem: z.string().default(""),
    isShiny: z.boolean().default(false),
    moves: z.tuple([MoveSlotSchema, MoveSlotSchema, MoveSlotSchema, MoveSlotSchema])
        .default([null, null, null, null]),
    ivs: IvSpreadValidationSchema.default(DEFAULT_IV_SPREAD),
    evs: EvSpreadValidationSchema.default(DEFAULT_EV_SPREAD),
})
