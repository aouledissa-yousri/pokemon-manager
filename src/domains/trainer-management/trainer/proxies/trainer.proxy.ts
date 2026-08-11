import { ApiResponseWrapper } from "../../../shared/DTOs/wrappers/api-response.wrapper"
import { ApiFactory } from "../../../shared/factories/api.factory"
import { ServerRoutesConfig } from "@/src/global/configs/routes/server-routes.config"
import { TrainerApiResponse } from "../DTOs/api-responses/trainer.api-response"
import { AddTrainerInput } from "../DTOs/inputs/add-trainer.input"
import { EditTrainerInput } from "../DTOs/inputs/edit-trainer.input"


const trainerApi = ApiFactory.createApi(ServerRoutesConfig.TRAINERS)

interface TrainerProxy {
    readonly findTrainers: () => Promise<ApiResponseWrapper<TrainerApiResponse[] | null>>
    readonly findUniqueTrainer: (trainerId: number) => Promise<ApiResponseWrapper<TrainerApiResponse | null>>
    readonly addTrainer: (addTrainerInput: AddTrainerInput) => Promise<ApiResponseWrapper<TrainerApiResponse | null>>
    readonly editTrainer: (editTrainerInput: EditTrainerInput) => Promise<ApiResponseWrapper<TrainerApiResponse | null>>
    readonly removeTrainer: (trainerId: number) => Promise<ApiResponseWrapper<null>>
}


export const trainerProxy: TrainerProxy = Object.freeze({

    findTrainers: async () => {
        const response = await trainerApi.get("")
        return response.data
    },

    findUniqueTrainer: async (trainerId: number) => {
        const response = await trainerApi.get(`/${trainerId}`)
        return response.data
    },

    addTrainer: async (addTrainerInput: AddTrainerInput) => {
        const formData = new FormData()
        formData.append("name", addTrainerInput.name)
        if (addTrainerInput.imageFile) formData.append("image", addTrainerInput.imageFile)

        const response = await trainerApi.post("", formData)
        return response.data
    },

    editTrainer: async (editTrainerInput: EditTrainerInput) => {
        const formData = new FormData()
        formData.append("name", editTrainerInput.name)
        if (editTrainerInput.imageFile) formData.append("image", editTrainerInput.imageFile)

        const response = await trainerApi.patch(`/${editTrainerInput.trainerId}`, formData)
        return response.data
    },

    removeTrainer: async (trainerId: number) => {
        const response = await trainerApi.delete(`/${trainerId}`)
        return response.data
    },
})