import { ApiResponseFactory } from "@/src/domains/shared/factories/api-response.factory"
import { trainerService } from "@/src/domains/trainer-management/trainer/services/trainer.service"


function parseTrainerId(id: string): number | null {
    const trainerId = Number.parseInt(id, 10)
    return Number.isNaN(trainerId) ? null : trainerId
}

function invalidIdResponse() {
    const failure = ApiResponseFactory.failure(400, "Invalid trainer id")
    return Response.json(failure, { status: failure.statusCode })
}


export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {

    const { id } = await params
    const trainerId = parseTrainerId(id)
    if (trainerId === null) return invalidIdResponse()

    const response = await trainerService.findUniqueTrainer(trainerId)
    return Response.json(response, { status: response.statusCode })
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {

    const { id } = await params
    const trainerId = parseTrainerId(id)
    if (trainerId === null) return invalidIdResponse()

    const formData = await request.formData()

    const name = formData.get("name")
    const imageFile = formData.get("image")

    const response = await trainerService.editTrainer(
        trainerId,
        typeof name === "string" && name.trim() ? name.trim() : null,
        imageFile instanceof File ? imageFile : null,
    )
    return Response.json(response, { status: response.statusCode })
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {

    const { id } = await params
    const trainerId = parseTrainerId(id)
    if (trainerId === null) return invalidIdResponse()

    const response = await trainerService.removeTrainer(trainerId)
    return Response.json(response, { status: response.statusCode })
}
