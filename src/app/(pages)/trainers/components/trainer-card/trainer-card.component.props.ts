import { TrainerApiResponse } from "@/src/domains/trainer-management/trainer/DTOs/api-responses/trainer.api-response"


export interface TrainerCardComponentProps {
    readonly trainer: TrainerApiResponse
    readonly onOpen: () => void
    readonly onEdit: () => void
    readonly onRemove: () => void
}
