/* eslint-disable @typescript-eslint/no-explicit-any */
// The generic query interface works against `this.table`, whose concrete column shape is only
// known in subclasses — mirroring the reference PersistenceModel's untyped `collection` access.

import { and, count, eq, sql } from "drizzle-orm"
import { SQLiteTable } from "drizzle-orm/sqlite-core"

import { DatabaseFactory } from "../factories/database.factory"


export class PersistenceModel<TRow extends { id: number }> {

    protected static table: SQLiteTable

    constructor(private data: Partial<TRow> = {}) { }

    public getData() { return this.data }

    public updateData(data: Partial<TRow>) {

        const target = this.data as Record<string, unknown>

        Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined) target[key] = value
        })
    }


    /* ------------------------------ DB Operations --------------------------------------*/


    public async save(): Promise<TRow> {

        const table = (this.constructor as typeof PersistenceModel).table

        return DatabaseFactory.getDatabase()
            .insert(table)
            .values(this.data)
            .returning()
            .get() as TRow
    }

    public async update(): Promise<TRow | null> {

        const table = (this.constructor as typeof PersistenceModel).table as any
        const { id, ...values } = this.data as any

        const row = DatabaseFactory.getDatabase()
            .update(table)
            .set({ ...values, updatedAt: sql`(datetime('now'))` })
            .where(eq(table.id, id))
            .returning()
            .get()

        return (row as TRow) ?? null
    }

    public async delete(): Promise<void> {

        const table = (this.constructor as typeof PersistenceModel).table as any

        DatabaseFactory.getDatabase()
            .delete(table)
            .where(eq(table.id, (this.data as any).id))
            .run()
    }


    /* ------------------------------ Query Interface ------------------------------------*/


    public static async getAll(): Promise<any[]> {
        return DatabaseFactory.getDatabase().select().from(this.table as any).all()
    }

    public static async getById(id: number): Promise<any | null> {

        const table = this.table as any

        const row = DatabaseFactory.getDatabase()
            .select()
            .from(table)
            .where(eq(table.id, id))
            .get()

        return row ?? null
    }

    public static async findUnique(filter: Record<string, unknown>): Promise<any | null> {

        const where = this.buildFilter(filter)
        const query = DatabaseFactory.getDatabase().select().from(this.table as any)

        const row = where ? query.where(where).get() : query.get()
        return row ?? null
    }

    public static async find(filter: Record<string, unknown> = {}, page?: number, limit?: number): Promise<any[]> {

        const where = this.buildFilter(filter)
        let query: any = DatabaseFactory.getDatabase().select().from(this.table as any)

        if (where) query = query.where(where)
        if (page && limit) query = query.limit(limit).offset((page - 1) * limit)

        return query.all()
    }

    public static async count(filter: Record<string, unknown> = {}): Promise<number> {

        const where = this.buildFilter(filter)
        let query: any = DatabaseFactory.getDatabase().select({ value: count() }).from(this.table as any)

        if (where) query = query.where(where)

        return query.get()?.value ?? 0
    }

    protected static buildFilter(filter: Record<string, unknown>) {

        const table = this.table as any

        const conditions = Object.entries(filter)
            .filter(([, value]) => value !== undefined)
            .map(([key, value]) => eq(table[key], value))

        return conditions.length ? and(...conditions) : undefined
    }
}
