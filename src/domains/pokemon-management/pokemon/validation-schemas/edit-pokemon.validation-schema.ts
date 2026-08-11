import { z } from "zod"

import { EditPokemonBaseValidationSchema } from "./edit-pokemon-base.validation-schema"


export const EditPokemonValidationSchema = EditPokemonBaseValidationSchema

export type EditPokemonValidationSchemaElements = z.output<typeof EditPokemonValidationSchema>
export type EditPokemonValidationSchemaInput = z.input<typeof EditPokemonValidationSchema>
