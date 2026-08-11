import { defineConfig } from "drizzle-kit";

export default defineConfig({
    dialect: "sqlite",
    schema: "./src/domains/**/schemas/*.schema.ts",
    out: "./drizzle",
    dbCredentials: {
        url: "data/pokemon-manager.db",
    },
});
