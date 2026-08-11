import { ApiResponseFactory } from "@/src/domains/shared/factories/api-response.factory"
import { trainerService } from "@/src/domains/trainer-management/trainer/services/trainer.service"


export async function GET() {
    const response = await trainerService.findTrainers()
    return Response.json(response, { status: response.statusCode })
}

export async function POST(request: Request) {

    const formData = await request.formData()

    const name = formData.get("name")
    const imageFile = formData.get("image")

    if (typeof name !== "string" || !name.trim()) {
        const failure = ApiResponseFactory.failure(400, "Trainer name is required")
        return Response.json(failure, { status: failure.statusCode })
    }

    const response = await trainerService.addTrainer(name.trim(), imageFile instanceof File ? imageFile : null)
    return Response.json(response, { status: response.statusCode })
}
