import { ApiResponseWrapper } from "../../../shared/DTOs/wrappers/api-response.wrapper"
import { ApiFactory } from "../../../shared/factories/api.factory"
import { ServerRoutesConfig } from "@/src/global/configs/routes/server-routes.config"
import { PokemonApiResponse } from "../DTOs/api-responses/pokemon.api-response"
import { AddPokemonInput } from "../DTOs/inputs/add-pokemon.input"
import { EditPokemonInput } from "../DTOs/inputs/edit-pokemon.input"
import { CopyPokemonInput } from "../DTOs/inputs/copy-pokemon.input"


const pokemonApi = ApiFactory.createApi(ServerRoutesConfig.POKEMON)

interface _PokemonProxy {
    readonly findPokemonList: (spaceId: number) => Promise<ApiResponseWrapper<PokemonApiResponse[] | null>>
    readonly findUniquePokemon: (pokemonId: number) => Promise<ApiResponseWrapper<PokemonApiResponse | null>>
    readonly addPokemon: (addPokemonInput: AddPokemonInput) => Promise<ApiResponseWrapper<PokemonApiResponse | null>>
    readonly editPokemon: (editPokemonInput: EditPokemonInput) => Promise<ApiResponseWrapper<PokemonApiResponse | null>>
    readonly removePokemon: (pokemonId: number) => Promise<ApiResponseWrapper<null>>
    readonly copyPokemon: (copyPokemonInput: CopyPokemonInput) => Promise<ApiResponseWrapper<PokemonApiResponse | null>>
    readonly reorderPokemon: (spaceId: number, orderedIds: number[]) => Promise<ApiResponseWrapper<null>>
}


export const pokemonProxy: _PokemonProxy = Object.freeze({

    findPokemonList: async (spaceId: number) => {
        const response = await pokemonApi.get("", { params: { spaceId } })
        return response.data
    },

    findUniquePokemon: async (pokemonId: number) => {
        const response = await pokemonApi.get(`/${pokemonId}`)
        return response.data
    },

    addPokemon: async (addPokemonInput: AddPokemonInput) => {
        const response = await pokemonApi.post("", addPokemonInput)
        return response.data
    },

    editPokemon: async (editPokemonInput: EditPokemonInput) => {
        const { pokemonId, ...editPokemonRequest } = editPokemonInput
        const response = await pokemonApi.patch(`/${pokemonId}`, editPokemonRequest)
        return response.data
    },

    removePokemon: async (pokemonId: number) => {
        const response = await pokemonApi.delete(`/${pokemonId}`)
        return response.data
    },

    copyPokemon: async (copyPokemonInput: CopyPokemonInput) => {
        const response = await pokemonApi.post(`/${copyPokemonInput.pokemonId}/copy`, {
            targetTrainerId: copyPokemonInput.targetTrainerId,
            targetSpaceId: copyPokemonInput.targetSpaceId,
        })
        return response.data
    },

    reorderPokemon: async (spaceId: number, orderedIds: number[]) => {
        const response = await pokemonApi.patch("/reorder", { spaceId, orderedIds })
        return response.data
    },
})
