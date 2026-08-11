import { TrainerDocument } from "../../schemas/trainer.schema"
import { TrainerApiResponse } from "../api-responses/trainer.api-response"


interface _TrainerMapper {
    readonly mapToApiResponse: (trainer: TrainerDocument, pokemonCount: number) => TrainerApiResponse
}

export const TrainerMapper: _TrainerMapper = Object.freeze({

    mapToApiResponse: (trainer: TrainerDocument, pokemonCount: number) => ({
        id: trainer.id,
        name: trainer.name,
        image: trainer.image,
        pokemonCount,
        createdAt: trainer.createdAt,
    }),
})
