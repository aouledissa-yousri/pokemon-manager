import { z } from "zod"

import { PokemonDefaultsConfig } from "../configs/pokemon-defaults.config"


export const AddPokemonFormValidationSchema = z.object({
    level: z.number().int()
        .min(PokemonDefaultsConfig.MIN_LEVEL)
        .max(PokemonDefaultsConfig.MAX_LEVEL)
        .default(PokemonDefaultsConfig.DEFAULT_LEVEL),
})

export type AddPokemonFormValidationSchemaElements = z.output<typeof AddPokemonFormValidationSchema>
export type AddPokemonFormValidationSchemaInput = z.input<typeof AddPokemonFormValidationSchema>
