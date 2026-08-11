import { ApiResponseWrapper } from "../../../shared/DTOs/wrappers/api-response.wrapper"
import { ApiFactory } from "../../../shared/factories/api.factory"
import { ServerRoutesConfig } from "@/src/global/configs/routes/server-routes.config"
import { MoveApiResponse } from "../DTOs/api-responses/move.api-response"


const moveApi = ApiFactory.createApi(ServerRoutesConfig.POKEDEX_MOVES)

interface _MoveProxy {
    readonly findMoveList: () => Promise<ApiResponseWrapper<MoveApiResponse[] | null>>
}


export const moveProxy: _MoveProxy = Object.freeze({

    findMoveList: async () => {
        const response = await moveApi.get("")
        return response.data
    },
})
