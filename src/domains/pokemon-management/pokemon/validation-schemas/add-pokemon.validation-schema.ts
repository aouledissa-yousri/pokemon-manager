import { z } from "zod"

import { PokemonDefaultsConfig } from "../configs/pokemon-defaults.config"


export const AddPokemonValidationSchema = z.object({
    spaceId: z.number().int().positive(),
    speciesId: z.number().int().positive(),
    speciesName: z.string().min(1),
    level: z.number().int()
        .min(PokemonDefaultsConfig.MIN_LEVEL)
        .max(PokemonDefaultsConfig.MAX_LEVEL)
        .default(PokemonDefaultsConfig.DEFAULT_LEVEL),
})

export type AddPokemonValidationSchemaElements = z.output<typeof AddPokemonValidationSchema>
