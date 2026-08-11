import { ApiResponseWrapper } from "../../../shared/DTOs/wrappers/api-response.wrapper"
import { ApiResponseFactory } from "../../../shared/factories/api-response.factory"
import { LocalStorageExternalGateway } from "../../../shared/external-gateways/local-storage.external-gateway"
import { FileHelper } from "../../../shared/helpers/file.helper"
import { TrainerModel, TrainerWithCountDocument } from "../models/trainer.model"
import { TrainerStorageConfig } from "../configs/trainer-storage.config"
import { TrainerApiResponse } from "../DTOs/api-responses/trainer.api-response"
import { TrainerMapper } from "../DTOs/mappers/trainer.mapper"


interface _TrainerService {
    readonly findTrainers: () => Promise<ApiResponseWrapper<TrainerApiResponse[] | null>>
    readonly findUniqueTrainer: (trainerId: number) => Promise<ApiResponseWrapper<TrainerApiResponse | null>>
    readonly addTrainer: (name: string, imageFile: File | null) => Promise<ApiResponseWrapper<TrainerApiResponse | null>>
    readonly editTrainer: (trainerId: number, name: string | null, imageFile: File | null) => Promise<ApiResponseWrapper<TrainerApiResponse | null>>
    readonly removeTrainer: (trainerId: number) => Promise<ApiResponseWrapper<null>>
    readonly uploadTrainerImage: (imageFile: File) => Promise<string>
}


export const trainerService: _TrainerService = Object.freeze({

    findTrainers: async () => {
        try {
            const trainers = await TrainerModel.findAllWithPokemonCount()
            return ApiResponseFactory.success(
                trainers.map((trainer: TrainerWithCountDocument) => TrainerMapper.mapToApiResponse(trainer, trainer.pokemonCount)),
                "Trainer List",
            )
        } catch {
            return ApiResponseFactory.failure(500, "Failed to load trainers")
        }
    },

    findUniqueTrainer: async (trainerId: number) => {
        try {
            const trainer = await TrainerModel.getById(trainerId)
            if (!trainer) return ApiResponseFactory.failure(404, "Trainer not found")

            const pokemonCount = await TrainerModel.getPokemonCount(trainerId)
            return ApiResponseFactory.success(TrainerMapper.mapToApiResponse(trainer, pokemonCount), "Trainer")
        } catch {
            return ApiResponseFactory.failure(500, "Failed to load trainer")
        }
    },

    addTrainer: async (name: string, imageFile: File | null) => {
        try {
            const image = imageFile ? await trainerService.uploadTrainerImage(imageFile) : null
            const trainer = await new TrainerModel({ name, image }).save()
            return ApiResponseFactory.success(TrainerMapper.mapToApiResponse(trainer, 0), "Trainer added")
        } catch {
            return ApiResponseFactory.failure(500, "Failed to add trainer")
        }
    },

    editTrainer: async (trainerId: number, name: string | null, imageFile: File | null) => {
        try {
            const record = await TrainerModel.getById(trainerId)
            if (!record) return ApiResponseFactory.failure(404, "Trainer not found")

            const newImage = imageFile ? await trainerService.uploadTrainerImage(imageFile) : undefined

            const trainer = new TrainerModel(record)
            trainer.updateData({ name: name ?? undefined, image: newImage })

            const updated = await trainer.update()
            if (!updated) return ApiResponseFactory.failure(404, "Trainer not found")

            if (newImage && record.image) LocalStorageExternalGateway.delete(record.image)

            const pokemonCount = await TrainerModel.getPokemonCount(trainerId)
            return ApiResponseFactory.success(TrainerMapper.mapToApiResponse(updated, pokemonCount), "Trainer updated")
        } catch {
            return ApiResponseFactory.failure(500, "Failed to update trainer")
        }
    },

    removeTrainer: async (trainerId: number) => {
        try {
            const record = await TrainerModel.getById(trainerId)
            if (!record) return ApiResponseFactory.failure(404, "Trainer not found")

            await new TrainerModel(record).delete()
            if (record.image) LocalStorageExternalGateway.delete(record.image)

            return ApiResponseFactory.success(null, "Trainer removed")
        } catch {
            return ApiResponseFactory.failure(500, "Failed to remove trainer")
        }
    },

    uploadTrainerImage: async (imageFile: File) => {
        const key = LocalStorageExternalGateway.createKey(
            [TrainerStorageConfig.FOLDER, `${Date.now()}`],
            FileHelper.getFileExtension(imageFile),
        )
        return LocalStorageExternalGateway.upload(imageFile, key)
    },
})
