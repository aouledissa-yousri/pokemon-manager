import { asc, eq } from "drizzle-orm"

import { PersistenceModel } from "../../../shared/persistences/persistence-model"
import { DatabaseFactory } from "../../../shared/factories/database.factory"
import { SpaceSchema, SpaceDocument } from "../schemas/space.schema"


export class SpaceModel extends PersistenceModel<SpaceDocument> {

    protected static table = SpaceSchema

    constructor(data: Partial<SpaceDocument> = {}) { super(data) }


    /* ----------------------------------- Setters --------------------------------------*/


    public setName(name: string) { this.getData().name = name }

    public setMetLocation(metLocation: string) { this.getData().metLocation = metLocation }


    public updateData({ name, metLocation }: { name?: string, metLocation?: string }) {

        if (name !== undefined) this.setName(name)
        if (metLocation !== undefined) this.setMetLocation(metLocation)
    }


    /* ------------------------------ Query Interface ------------------------------------*/


    public static async getById(id: number): Promise<SpaceDocument | null> {
        return super.getById(id)
    }

    public static async findByTrainerId(trainerId: number): Promise<SpaceDocument[]> {

        return DatabaseFactory.getDatabase()
            .select()
            .from(SpaceSchema)
            .where(eq(SpaceSchema.trainerId, trainerId))
            .orderBy(asc(SpaceSchema.id))
            .all()
    }
}
