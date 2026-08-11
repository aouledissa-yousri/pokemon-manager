import { sql } from "drizzle-orm"
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core"

import { SpaceSchema } from "../../../trainer-management/space/schemas/space.schema"
import { NatureEnum } from "../../../pokedex/nature/enums/nature.enum"


export const PokemonSchema = sqliteTable("pokemon", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    spaceId: integer("space_id").notNull().references(() => SpaceSchema.id, { onDelete: "cascade" }),

    speciesId: integer("species_id").notNull(),
    speciesName: text("species_name").notNull(),

    level: integer("level").notNull().default(50),
    nature: text("nature", { enum: Object.values(NatureEnum) as [NatureEnum, ...NatureEnum[]] }).notNull().default(NatureEnum.HARDY),
    ability: text("ability").notNull().default(""),
    heldItem: text("held_item").notNull().default(""),
    isShiny: integer("is_shiny", { mode: "boolean" }).notNull().default(false),

    move1: text("move_1"),
    move2: text("move_2"),
    move3: text("move_3"),
    move4: text("move_4"),

    ivHp: integer("iv_hp").notNull().default(31),
    ivAttack: integer("iv_attack").notNull().default(31),
    ivDefense: integer("iv_defense").notNull().default(31),
    ivSpecialAttack: integer("iv_special_attack").notNull().default(31),
    ivSpecialDefense: integer("iv_special_defense").notNull().default(31),
    ivSpeed: integer("iv_speed").notNull().default(31),

    evHp: integer("ev_hp").notNull().default(0),
    evAttack: integer("ev_attack").notNull().default(0),
    evDefense: integer("ev_defense").notNull().default(0),
    evSpecialAttack: integer("ev_special_attack").notNull().default(0),
    evSpecialDefense: integer("ev_special_defense").notNull().default(0),
    evSpeed: integer("ev_speed").notNull().default(0),

    createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
    updatedAt: text("updated_at").notNull().default(sql`(datetime('now'))`),
}, (table) => [
    index("idx_pokemon_space_id").on(table.spaceId),
])

export type PokemonDocument = typeof PokemonSchema.$inferSelect
