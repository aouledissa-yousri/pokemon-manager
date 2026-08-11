import { count, eq } from "drizzle-orm"

import { PersistenceModel } from "../../../shared/persistences/persistence-model"
import { DatabaseFactory } from "../../../shared/factories/database.factory"
import { TrainerSchema, TrainerDocument } from "../schemas/trainer.schema"
import { SpaceSchema } from "../../space/schemas/space.schema"
import { PokemonSchema } from "../../../pokemon-management/pokemon/schemas/pokemon.schema"


export interface TrainerWithCountDocument extends TrainerDocument {
    readonly pokemonCount: number
}


export class TrainerModel extends PersistenceModel<TrainerDocument> {

    protected static table = TrainerSchema

    constructor(data: Partial<TrainerDocument> = {}) { super(data) }


    /* ----------------------------------- Setters --------------------------------------*/


    public setName(name: string) { this.getData().name = name }

    public setImage(image: string | null) { this.getData().image = image }


    public updateData({ name, image }: { name?: string, image?: string | null }) {

        if (name) this.setName(name)
        if (image !== undefined) this.setImage(image)
    }


    /* ------------------------------ Query Interface ------------------------------------*/


    public static async getById(id: number): Promise<TrainerDocument | null> {
        return super.getById(id)
    }

    public static async findAllWithPokemonCount(): Promise<TrainerWithCountDocument[]> {

        return DatabaseFactory.getDatabase()
            .select({
                id: TrainerSchema.id,
                name: TrainerSchema.name,
                image: TrainerSchema.image,
                sortOrder: TrainerSchema.sortOrder,
                createdAt: TrainerSchema.createdAt,
                updatedAt: TrainerSchema.updatedAt,
                pokemonCount: count(PokemonSchema.id),
            })
            .from(TrainerSchema)
            .leftJoin(SpaceSchema, eq(SpaceSchema.trainerId, TrainerSchema.id))
            .leftJoin(PokemonSchema, eq(PokemonSchema.spaceId, SpaceSchema.id))
            .groupBy(TrainerSchema.id)
            .orderBy(TrainerSchema.sortOrder)
            .all()
    }

    public static async getPokemonCount(trainerId: number): Promise<number> {

        const row = DatabaseFactory.getDatabase()
            .select({ value: count(PokemonSchema.id) })
            .from(PokemonSchema)
            .innerJoin(SpaceSchema, eq(PokemonSchema.spaceId, SpaceSchema.id))
            .where(eq(SpaceSchema.trainerId, trainerId))
            .get()

        return row?.value ?? 0
    }

    public static async reorder(orderedIds: number[]): Promise<void> {

        const db = DatabaseFactory.getDatabase()

        db.transaction((tx) => {
            orderedIds.forEach((id, index) => {
                tx.update(TrainerSchema).set({ sortOrder: index }).where(eq(TrainerSchema.id, id)).run()
            })
        })
    }
}
