import { ApiResponseWrapper } from "../../../shared/DTOs/wrappers/api-response.wrapper"
import { ApiResponseFactory } from "../../../shared/factories/api-response.factory"
import { TrainerModel } from "../../trainer/models/trainer.model"
import { SpaceModel } from "../models/space.model"
import { SpaceApiResponse } from "../DTOs/api-responses/space.api-response"
import { SpaceMapper } from "../DTOs/mappers/space.mapper"
import { AddSpaceInput } from "../DTOs/inputs/add-space.input"
import { EditSpaceInput } from "../DTOs/inputs/edit-space.input"
import { PokemonModel } from "../../../pokemon-management/pokemon/models/pokemon.model"
import { PokemonApiResponse } from "../../../pokemon-management/pokemon/DTOs/api-responses/pokemon.api-response"
import { PokemonMapper } from "../../../pokemon-management/pokemon/DTOs/mappers/pokemon.mapper"


interface _SpaceService {
    readonly findSpaces: (trainerId: number) => Promise<ApiResponseWrapper<SpaceApiResponse[] | null>>
    readonly addSpace: (addSpaceInput: AddSpaceInput) => Promise<ApiResponseWrapper<SpaceApiResponse | null>>
    readonly editSpace: (editSpaceInput: EditSpaceInput) => Promise<ApiResponseWrapper<SpaceApiResponse | null>>
    readonly removeSpace: (spaceId: number) => Promise<ApiResponseWrapper<null>>
    readonly reorderSpaces: (trainerId: number, parentSpaceId: number | null, orderedIds: number[]) => Promise<ApiResponseWrapper<null>>
}


export const spaceService: _SpaceService = Object.freeze({

    findSpaces: async (trainerId: number) => {
        try {
            const trainer = await TrainerModel.getById(trainerId)
            if (!trainer) return ApiResponseFactory.failure(404, "Trainer not found")

            const spaces = await SpaceModel.findByTrainerId(trainerId)
            const pokemonRows = await PokemonModel.findByTrainerId(trainerId)

            const pokemonBySpaceId = new Map<number, PokemonApiResponse[]>()
            pokemonRows.forEach(pokemon => {
                const mapped = PokemonMapper.mapToApiResponse(pokemon)
                const existing = pokemonBySpaceId.get(pokemon.spaceId) ?? []
                existing.push(mapped)
                pokemonBySpaceId.set(pokemon.spaceId, existing)
            })

            return ApiResponseFactory.success(SpaceMapper.buildTree(spaces, pokemonBySpaceId), "Space List")
        } catch {
            return ApiResponseFactory.failure(500, "Failed to load spaces")
        }
    },

    addSpace: async (addSpaceInput: AddSpaceInput) => {
        try {
            const trainer = await TrainerModel.getById(addSpaceInput.trainerId)
            if (!trainer) return ApiResponseFactory.failure(404, "Trainer not found")

            if (addSpaceInput.parentSpaceId !== null) {
                const parentSpace = await SpaceModel.getById(addSpaceInput.parentSpaceId)
                if (!parentSpace || parentSpace.trainerId !== addSpaceInput.trainerId) {
                    return ApiResponseFactory.failure(400, "Parent space does not belong to this trainer")
                }
            }

            const space = await new SpaceModel({
                trainerId: addSpaceInput.trainerId,
                parentSpaceId: addSpaceInput.parentSpaceId,
                name: addSpaceInput.name,
                metLocation: addSpaceInput.metLocation,
            }).save()

            return ApiResponseFactory.success(SpaceMapper.mapToApiResponse(space, [], []), "Space added")
        } catch {
            return ApiResponseFactory.failure(500, "Failed to add space")
        }
    },

    editSpace: async (editSpaceInput: EditSpaceInput) => {
        try {
            const record = await SpaceModel.getById(editSpaceInput.spaceId)
            if (!record) return ApiResponseFactory.failure(404, "Space not found")

            const space = new SpaceModel(record)
            space.updateData({ name: editSpaceInput.name, metLocation: editSpaceInput.metLocation })

            const updated = await space.update()
            if (!updated) return ApiResponseFactory.failure(404, "Space not found")

            const pokemonRows = await PokemonModel.findBySpaceId(updated.id)
            return ApiResponseFactory.success(
                SpaceMapper.mapToApiResponse(updated, pokemonRows.map(PokemonMapper.mapToApiResponse), []),
                "Space updated",
            )
        } catch {
            return ApiResponseFactory.failure(500, "Failed to update space")
        }
    },

    removeSpace: async (spaceId: number) => {
        try {
            const record = await SpaceModel.getById(spaceId)
            if (!record) return ApiResponseFactory.failure(404, "Space not found")

            await new SpaceModel(record).delete()
            return ApiResponseFactory.success(null, "Space removed")
        } catch {
            return ApiResponseFactory.failure(500, "Failed to remove space")
        }
    },

    reorderSpaces: async (trainerId: number, parentSpaceId: number | null, orderedIds: number[]) => {
        try {
            const allSpaces = await SpaceModel.findByTrainerId(trainerId)
            const siblingIds = new Set(
                allSpaces.filter(space => space.parentSpaceId === parentSpaceId).map(space => space.id),
            )

            const isValidPermutation = orderedIds.length === siblingIds.size
                && orderedIds.every(id => siblingIds.has(id))

            if (!isValidPermutation) return ApiResponseFactory.failure(400, "orderedIds must match the parent's direct child spaces exactly")

            await SpaceModel.reorder(orderedIds)
            return ApiResponseFactory.success(null, "Spaces reordered")
        } catch {
            return ApiResponseFactory.failure(500, "Failed to reorder spaces")
        }
    },
})
