import { ApiResponseWrapper } from "../../../shared/DTOs/wrappers/api-response.wrapper"
import { ApiFactory } from "../../../shared/factories/api.factory"
import { ServerRoutesConfig } from "@/src/global/configs/routes/server-routes.config"
import { SpaceApiResponse } from "../DTOs/api-responses/space.api-response"
import { AddSpaceInput } from "../DTOs/inputs/add-space.input"
import { EditSpaceInput } from "../DTOs/inputs/edit-space.input"


const spaceApi = ApiFactory.createApi(ServerRoutesConfig.SPACES)

interface _SpaceProxy {
    readonly findSpaces: (trainerId: number) => Promise<ApiResponseWrapper<SpaceApiResponse[] | null>>
    readonly addSpace: (addSpaceInput: AddSpaceInput) => Promise<ApiResponseWrapper<SpaceApiResponse | null>>
    readonly editSpace: (editSpaceInput: EditSpaceInput) => Promise<ApiResponseWrapper<SpaceApiResponse | null>>
    readonly removeSpace: (spaceId: number) => Promise<ApiResponseWrapper<null>>
}


export const spaceProxy: _SpaceProxy = Object.freeze({

    findSpaces: async (trainerId: number) => {
        const response = await spaceApi.get("", { params: { trainerId } })
        return response.data
    },

    addSpace: async (addSpaceInput: AddSpaceInput) => {
        const response = await spaceApi.post("", addSpaceInput)
        return response.data
    },

    editSpace: async (editSpaceInput: EditSpaceInput) => {
        const { spaceId, ...editSpaceRequest } = editSpaceInput
        const response = await spaceApi.patch(`/${spaceId}`, editSpaceRequest)
        return response.data
    },

    removeSpace: async (spaceId: number) => {
        const response = await spaceApi.delete(`/${spaceId}`)
        return response.data
    },
})
