import { z } from "zod"


export const TrainerFormValidationSchema = z.object({
    name: z.string().min(1, "Trainer name is required").max(50, "Trainer name is too long").default(""),
})

export type TrainerFormValidationSchemaElements = z.output<typeof TrainerFormValidationSchema>
export type TrainerFormValidationSchemaInput = z.input<typeof TrainerFormValidationSchema>
