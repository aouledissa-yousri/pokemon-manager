import { ApiResponseFactory } from "@/src/domains/shared/factories/api-response.factory"
import { trainerService } from "@/src/domains/trainer-management/trainer/services/trainer.service"


export async function PATCH(request: Request) {

    const body = await request.json().catch(() => null)

    const orderedIds = Array.isArray(body?.orderedIds)
        ? body.orderedIds.filter((id: unknown) => typeof id === "number")
        : null

    if (!orderedIds || orderedIds.length === 0) {
        const failure = ApiResponseFactory.failure(400, "orderedIds must be a non-empty array of numbers")
        return Response.json(failure, { status: failure.statusCode })
    }

    const response = await trainerService.reorderTrainers(orderedIds)
    return Response.json(response, { status: response.statusCode })
}
