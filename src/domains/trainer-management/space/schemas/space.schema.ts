import { sql } from "drizzle-orm"
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core"

import { TrainerSchema } from "../../trainer/schemas/trainer.schema"


export const SpaceSchema = sqliteTable("spaces", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    trainerId: integer("trainer_id").notNull().references(() => TrainerSchema.id, { onDelete: "cascade" }),

    name: text("name").notNull().default(""),
    metLocation: text("met_location").notNull().default(""),
    sortOrder: integer("sort_order").notNull().default(0),

    createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
    updatedAt: text("updated_at").notNull().default(sql`(datetime('now'))`),
}, (table) => [
    index("idx_spaces_trainer_id").on(table.trainerId),
])

export type SpaceDocument = typeof SpaceSchema.$inferSelect
