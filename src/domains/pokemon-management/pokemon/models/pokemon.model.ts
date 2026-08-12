import { asc, eq } from "drizzle-orm"

import { PersistenceModel } from "../../../shared/persistences/persistence-model"
import { DatabaseFactory } from "../../../shared/factories/database.factory"
import { PokemonSchema, PokemonDocument } from "../schemas/pokemon.schema"
import { SpaceSchema } from "../../../trainer-management/space/schemas/space.schema"
import { NatureEnum } from "../../../pokedex/nature/enums/nature.enum"


export class PokemonModel extends PersistenceModel<PokemonDocument> {

    protected static table = PokemonSchema

    constructor(data: Partial<PokemonDocument> = {}) { super(data) }


    /* ----------------------------------- Setters --------------------------------------*/


    public setLevel(level: number) { this.getData().level = level }

    public setNature(nature: NatureEnum) { this.getData().nature = nature }

    public setAbility(ability: string) { this.getData().ability = ability }

    public setHeldItem(heldItem: string) { this.getData().heldItem = heldItem }

    public setIsShiny(isShiny: boolean) { this.getData().isShiny = isShiny }


    /* ------------------------------ Query Interface ------------------------------------*/


    public static async getById(id: number): Promise<PokemonDocument | null> {
        return super.getById(id)
    }

    public static async findBySpaceId(spaceId: number): Promise<PokemonDocument[]> {

        return DatabaseFactory.getDatabase()
            .select()
            .from(PokemonSchema)
            .where(eq(PokemonSchema.spaceId, spaceId))
            .orderBy(asc(PokemonSchema.sortOrder))
            .all()
    }

    public static async findByTrainerId(trainerId: number): Promise<PokemonDocument[]> {

        const rows = DatabaseFactory.getDatabase()
            .select({ pokemon: PokemonSchema })
            .from(PokemonSchema)
            .innerJoin(SpaceSchema, eq(PokemonSchema.spaceId, SpaceSchema.id))
            .where(eq(SpaceSchema.trainerId, trainerId))
            .orderBy(asc(PokemonSchema.sortOrder))
            .all()

        return rows.map(row => row.pokemon)
    }

    public static async reorder(pokemonIds: number[]): Promise<void> {

        const db = DatabaseFactory.getDatabase()

        db.transaction((tx) => {
            pokemonIds.forEach((id, index) => {
                tx.update(PokemonSchema).set({ sortOrder: index }).where(eq(PokemonSchema.id, id)).run()
            })
        })
    }

    public static async copyToSpace(pokemonId: number, targetSpaceId: number): Promise<PokemonDocument | null> {

        const record = await PokemonModel.getById(pokemonId)
        if (!record) return null

        const clone: Partial<PokemonDocument> = { ...record, spaceId: targetSpaceId }
        delete clone.id
        delete clone.createdAt
        delete clone.updatedAt

        return new PokemonModel(clone).save()
    }
}
