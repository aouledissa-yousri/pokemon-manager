import { ApiResponseFactory } from "@/src/domains/shared/factories/api-response.factory"
import { spaceService } from "@/src/domains/trainer-management/space/services/space.service"


export async function PATCH(request: Request) {

    const body = await request.json().catch(() => null)

    const trainerId = Number.parseInt(`${body?.trainerId}`, 10)
    const orderedIds = Array.isArray(body?.orderedIds)
        ? body.orderedIds.filter((id: unknown) => typeof id === "number")
        : null

    if (Number.isNaN(trainerId) || !orderedIds || orderedIds.length === 0) {
        const failure = ApiResponseFactory.failure(400, "trainerId and a non-empty orderedIds array are required")
        return Response.json(failure, { status: failure.statusCode })
    }

    const response = await spaceService.reorderSpaces(trainerId, orderedIds)
    return Response.json(response, { status: response.statusCode })
}
