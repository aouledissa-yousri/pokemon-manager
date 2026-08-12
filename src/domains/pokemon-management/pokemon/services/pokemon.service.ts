import { ApiResponseWrapper } from "../../../shared/DTOs/wrappers/api-response.wrapper"
import { ApiResponseFactory } from "../../../shared/factories/api-response.factory"
import { TrainerModel } from "../../../trainer-management/trainer/models/trainer.model"
import { SpaceModel } from "../../../trainer-management/space/models/space.model"
import { PokemonModel } from "../models/pokemon.model"
import { PokemonDefaultsConfig } from "../configs/pokemon-defaults.config"
import { PokemonApiResponse } from "../DTOs/api-responses/pokemon.api-response"
import { PokemonMapper } from "../DTOs/mappers/pokemon.mapper"
import { AddPokemonInput } from "../DTOs/inputs/add-pokemon.input"
import { EditPokemonInput } from "../DTOs/inputs/edit-pokemon.input"
import { CopyPokemonInput } from "../DTOs/inputs/copy-pokemon.input"


interface _PokemonService {
    readonly findPokemonList: (spaceId: number) => Promise<ApiResponseWrapper<PokemonApiResponse[] | null>>
    readonly findUniquePokemon: (pokemonId: number) => Promise<ApiResponseWrapper<PokemonApiResponse | null>>
    readonly addPokemon: (addPokemonInput: AddPokemonInput) => Promise<ApiResponseWrapper<PokemonApiResponse | null>>
    readonly editPokemon: (editPokemonInput: EditPokemonInput) => Promise<ApiResponseWrapper<PokemonApiResponse | null>>
    readonly removePokemon: (pokemonId: number) => Promise<ApiResponseWrapper<null>>
    readonly copyPokemon: (copyPokemonInput: CopyPokemonInput) => Promise<ApiResponseWrapper<PokemonApiResponse | null>>
    readonly reorderPokemon: (spaceId: number, orderedIds: number[]) => Promise<ApiResponseWrapper<null>>
}


export const pokemonService: _PokemonService = Object.freeze({

    findPokemonList: async (spaceId: number) => {
        try {
            const space = await SpaceModel.getById(spaceId)
            if (!space) return ApiResponseFactory.failure(404, "Space not found")

            const pokemonList = await PokemonModel.findBySpaceId(spaceId)
            return ApiResponseFactory.success(pokemonList.map(PokemonMapper.mapToApiResponse), "Pokemon List")
        } catch {
            return ApiResponseFactory.failure(500, "Failed to load Pokemon")
        }
    },

    findUniquePokemon: async (pokemonId: number) => {
        try {
            const pokemon = await PokemonModel.getById(pokemonId)
            if (!pokemon) return ApiResponseFactory.failure(404, "Pokemon not found")

            return ApiResponseFactory.success(PokemonMapper.mapToApiResponse(pokemon), "Pokemon")
        } catch {
            return ApiResponseFactory.failure(500, "Failed to load Pokemon")
        }
    },

    addPokemon: async (addPokemonInput: AddPokemonInput) => {
        try {
            const space = await SpaceModel.getById(addPokemonInput.spaceId)
            if (!space) return ApiResponseFactory.failure(404, "Space not found")

            const pokemon = await new PokemonModel({
                spaceId: addPokemonInput.spaceId,
                speciesId: addPokemonInput.speciesId,
                speciesName: addPokemonInput.speciesName,
                level: addPokemonInput.level ?? PokemonDefaultsConfig.DEFAULT_LEVEL,
            }).save()

            return ApiResponseFactory.success(PokemonMapper.mapToApiResponse(pokemon), "Pokemon added")
        } catch {
            return ApiResponseFactory.failure(500, "Failed to add Pokemon")
        }
    },

    editPokemon: async (editPokemonInput: EditPokemonInput) => {
        try {
            const record = await PokemonModel.getById(editPokemonInput.pokemonId)
            if (!record) return ApiResponseFactory.failure(404, "Pokemon not found")

            const pokemon = new PokemonModel(record)
            pokemon.updateData(PokemonMapper.mapEditInputToColumns(editPokemonInput))

            const updated = await pokemon.update()
            if (!updated) return ApiResponseFactory.failure(404, "Pokemon not found")

            return ApiResponseFactory.success(PokemonMapper.mapToApiResponse(updated), "Pokemon updated")
        } catch {
            return ApiResponseFactory.failure(500, "Failed to update Pokemon")
        }
    },

    removePokemon: async (pokemonId: number) => {
        try {
            const record = await PokemonModel.getById(pokemonId)
            if (!record) return ApiResponseFactory.failure(404, "Pokemon not found")

            await new PokemonModel(record).delete()
            return ApiResponseFactory.success(null, "Pokemon removed")
        } catch {
            return ApiResponseFactory.failure(500, "Failed to remove Pokemon")
        }
    },

    copyPokemon: async (copyPokemonInput: CopyPokemonInput) => {
        try {
            const targetTrainer = await TrainerModel.getById(copyPokemonInput.targetTrainerId)
            if (!targetTrainer) return ApiResponseFactory.failure(404, "Target trainer not found")

            const source = await PokemonModel.getById(copyPokemonInput.pokemonId)
            if (!source) return ApiResponseFactory.failure(404, "Pokemon not found")

            let targetSpaceId = copyPokemonInput.targetSpaceId

            if (targetSpaceId !== undefined) {
                const targetSpace = await SpaceModel.getById(targetSpaceId)
                if (!targetSpace || targetSpace.trainerId !== copyPokemonInput.targetTrainerId) {
                    return ApiResponseFactory.failure(400, "Target space does not belong to the target trainer")
                }
            } else {
                const sourceSpace = await SpaceModel.getById(source.spaceId)
                const newSpace = await new SpaceModel({
                    trainerId: copyPokemonInput.targetTrainerId,
                    name: source.speciesName,
                    metLocation: sourceSpace?.metLocation ?? "",
                }).save()
                targetSpaceId = newSpace.id
            }

            const copy = await PokemonModel.copyToSpace(copyPokemonInput.pokemonId, targetSpaceId)
            if (!copy) return ApiResponseFactory.failure(404, "Pokemon not found")

            return ApiResponseFactory.success(PokemonMapper.mapToApiResponse(copy), `Copied to ${targetTrainer.name}`)
        } catch {
            return ApiResponseFactory.failure(500, "Failed to copy Pokemon")
        }
    },

    reorderPokemon: async (spaceId: number, orderedIds: number[]) => {
        try {
            const existingPokemon = await PokemonModel.findBySpaceId(spaceId)
            const existingIds = new Set(existingPokemon.map(pokemon => pokemon.id))

            const isValidPermutation = orderedIds.length === existingIds.size
                && orderedIds.every(id => existingIds.has(id))

            if (!isValidPermutation) return ApiResponseFactory.failure(400, "orderedIds must match the space's Pokemon exactly")

            await PokemonModel.reorder(orderedIds)
            return ApiResponseFactory.success(null, "Pokemon reordered")
        } catch {
            return ApiResponseFactory.failure(500, "Failed to reorder Pokemon")
        }
    },
})
