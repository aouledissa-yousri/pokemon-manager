import { z } from "zod"

import { PokemonDefaultsConfig } from "../configs/pokemon-defaults.config"


const IvValueSchema = z.number().int()
    .min(PokemonDefaultsConfig.MIN_IV)
    .max(PokemonDefaultsConfig.MAX_IV)
    .default(PokemonDefaultsConfig.DEFAULT_IV)

export const IvSpreadValidationSchema = z.object({
    hp: IvValueSchema,
    attack: IvValueSchema,
    defense: IvValueSchema,
    specialAttack: IvValueSchema,
    specialDefense: IvValueSchema,
    speed: IvValueSchema,
})

export const DEFAULT_IV_SPREAD = Object.freeze(IvSpreadValidationSchema.parse({}))

export type IvSpreadValidationSchemaElements = z.output<typeof IvSpreadValidationSchema>
