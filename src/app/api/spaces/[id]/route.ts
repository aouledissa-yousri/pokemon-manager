import { ApiResponseFactory } from "@/src/domains/shared/factories/api-response.factory"
import { spaceService } from "@/src/domains/trainer-management/space/services/space.service"
import { SpaceFormValidationSchema } from "@/src/domains/trainer-management/space/validation-schemas/space-form.validation-schema"


function parseSpaceId(id: string): number | null {
    const spaceId = Number.parseInt(id, 10)
    return Number.isNaN(spaceId) ? null : spaceId
}

function invalidIdResponse() {
    const failure = ApiResponseFactory.failure(400, "Invalid space id")
    return Response.json(failure, { status: failure.statusCode })
}


export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {

    const { id } = await params
    const spaceId = parseSpaceId(id)
    if (spaceId === null) return invalidIdResponse()

    const body = await request.json().catch(() => null)
    const parsed = SpaceFormValidationSchema.safeParse(body)

    if (!parsed.success) {
        const failure = ApiResponseFactory.failure(400, parsed.error.issues[0]?.message ?? "Invalid space data")
        return Response.json(failure, { status: failure.statusCode })
    }

    const response = await spaceService.editSpace({ spaceId, ...parsed.data })
    return Response.json(response, { status: response.statusCode })
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {

    const { id } = await params
    const spaceId = parseSpaceId(id)
    if (spaceId === null) return invalidIdResponse()

    const response = await spaceService.removeSpace(spaceId)
    return Response.json(response, { status: response.statusCode })
}
