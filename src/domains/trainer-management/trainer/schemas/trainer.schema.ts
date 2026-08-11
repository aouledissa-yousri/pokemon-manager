import { sql } from "drizzle-orm"
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core"


export const TrainerSchema = sqliteTable("trainers", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    image: text("image"),
    createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
    updatedAt: text("updated_at").notNull().default(sql`(datetime('now'))`),
})

export type TrainerDocument = typeof TrainerSchema.$inferSelect
