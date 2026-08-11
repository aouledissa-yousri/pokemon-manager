import { z } from "zod"


export const SpaceFormValidationSchema = z.object({
    name: z.string().max(50, "Space name is too long").default(""),
    metLocation: z.string().max(120, "Met location is too long").default(""),
})

export type SpaceFormValidationSchemaElements = z.output<typeof SpaceFormValidationSchema>
export type SpaceFormValidationSchemaInput = z.input<typeof SpaceFormValidationSchema>
