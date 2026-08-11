import { z } from "zod"

import { PokemonDefaultsConfig } from "../configs/pokemon-defaults.config"


const EvValueSchema = z.number().int()
    .min(PokemonDefaultsConfig.MIN_EV)
    .max(PokemonDefaultsConfig.MAX_EV)
    .default(PokemonDefaultsConfig.DEFAULT_EV)

export const EvSpreadValidationSchema = z.object({
    hp: EvValueSchema,
    attack: EvValueSchema,
    defense: EvValueSchema,
    specialAttack: EvValueSchema,
    specialDefense: EvValueSchema,
    speed: EvValueSchema,
})

export const DEFAULT_EV_SPREAD = Object.freeze(EvSpreadValidationSchema.parse({}))

export type EvSpreadValidationSchemaElements = z.output<typeof EvSpreadValidationSchema>
