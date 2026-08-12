import { ApiResponseFactory } from "@/src/domains/shared/factories/api-response.factory"
import { spaceService } from "@/src/domains/trainer-management/space/services/space.service"
import { SpaceFormValidationSchema } from "@/src/domains/trainer-management/space/validation-schemas/space-form.validation-schema"


export async function GET(request: Request) {

    const trainerId = Number.parseInt(new URL(request.url).searchParams.get("trainerId") ?? "", 10)

    if (Number.isNaN(trainerId)) {
        const failure = ApiResponseFactory.failure(400, "A valid trainerId query parameter is required")
        return Response.json(failure, { status: failure.statusCode })
    }

    const response = await spaceService.findSpaces(trainerId)
    return Response.json(response, { status: response.statusCode })
}

export async function POST(request: Request) {

    const body = await request.json().catch(() => null)

    const trainerId = Number.parseInt(`${body?.trainerId}`, 10)
    if (Number.isNaN(trainerId)) {
        const failure = ApiResponseFactory.failure(400, "A valid trainerId is required")
        return Response.json(failure, { status: failure.statusCode })
    }

    const parsed = SpaceFormValidationSchema.safeParse(body)
    if (!parsed.success) {
        const failure = ApiResponseFactory.failure(400, parsed.error.issues[0]?.message ?? "Invalid space data")
        return Response.json(failure, { status: failure.statusCode })
    }

    const rawParentSpaceId = body?.parentSpaceId
    const parentSpaceId = rawParentSpaceId === null || rawParentSpaceId === undefined
        ? null
        : Number.parseInt(`${rawParentSpaceId}`, 10)

    if (parentSpaceId !== null && Number.isNaN(parentSpaceId)) {
        const failure = ApiResponseFactory.failure(400, "parentSpaceId must be a number or null")
        return Response.json(failure, { status: failure.statusCode })
    }

    const response = await spaceService.addSpace({ trainerId, parentSpaceId, ...parsed.data })
    return Response.json(response, { status: response.statusCode })
}
