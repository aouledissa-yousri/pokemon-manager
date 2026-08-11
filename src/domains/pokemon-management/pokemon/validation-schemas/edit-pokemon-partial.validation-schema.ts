import { z } from "zod"

import { NatureEnum } from "../../../pokedex/nature/enums/nature.enum"
import { PokemonDefaultsConfig } from "../configs/pokemon-defaults.config"


// Deliberately built WITHOUT .default() on any field: a PATCH must leave missing
// fields undefined — deriving this from the defaulted base schema would silently
// reset every omitted field to its default value.

const MoveSlotSchema = z.string().nullable()

const IvValueSchema = z.number().int()
    .min(PokemonDefaultsConfig.MIN_IV)
    .max(PokemonDefaultsConfig.MAX_IV)

const EvValueSchema = z.number().int()
    .min(PokemonDefaultsConfig.MIN_EV)
    .max(PokemonDefaultsConfig.MAX_EV)


export const EditPokemonPartialValidationSchema = z.object({
    level: z.number().int()
        .min(PokemonDefaultsConfig.MIN_LEVEL)
        .max(PokemonDefaultsConfig.MAX_LEVEL)
        .optional(),
    nature: z.enum(NatureEnum).optional(),
    ability: z.string().optional(),
    heldItem: z.string().optional(),
    isShiny: z.boolean().optional(),
    moves: z.tuple([MoveSlotSchema, MoveSlotSchema, MoveSlotSchema, MoveSlotSchema]).optional(),
    ivs: z.object({
        hp: IvValueSchema,
        attack: IvValueSchema,
        defense: IvValueSchema,
        specialAttack: IvValueSchema,
        specialDefense: IvValueSchema,
        speed: IvValueSchema,
    }).optional(),
    evs: z.object({
        hp: EvValueSchema,
        attack: EvValueSchema,
        defense: EvValueSchema,
        specialAttack: EvValueSchema,
        specialDefense: EvValueSchema,
        speed: EvValueSchema,
    }).optional(),
})

export type EditPokemonPartialValidationSchemaElements = z.output<typeof EditPokemonPartialValidationSchema>
