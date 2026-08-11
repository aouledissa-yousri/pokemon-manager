import fs from "fs"
import path from "path"
import Database from "better-sqlite3"
import { drizzle, BetterSQLite3Database } from "drizzle-orm/better-sqlite3"
import { migrate } from "drizzle-orm/better-sqlite3/migrator"


interface _DatabaseFactory {
    readonly getDatabase: () => BetterSQLite3Database
}

const globalCache = globalThis as unknown as { __pokemonManagerDatabase?: BetterSQLite3Database }

export const DatabaseFactory: _DatabaseFactory = Object.freeze({

    getDatabase: () => {

        if (globalCache.__pokemonManagerDatabase) return globalCache.__pokemonManagerDatabase

        const dataDir = path.join(process.cwd(), "data")
        fs.mkdirSync(dataDir, { recursive: true })

        const sqlite = new Database(path.join(dataDir, "pokemon-manager.db"))
        sqlite.pragma("journal_mode = WAL")
        sqlite.pragma("foreign_keys = ON")

        const database = drizzle(sqlite)
        migrate(database, { migrationsFolder: path.join(process.cwd(), "drizzle") })

        globalCache.__pokemonManagerDatabase = database
        return database
    },
})
