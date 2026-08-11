import { ApiResponseFactory } from "@/src/domains/shared/factories/api-response.factory"
import { speciesService } from "@/src/domains/pokedex/species/services/species.service"


export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {

    const { id } = await params
    const speciesId = Number.parseInt(id, 10)

    if (Number.isNaN(speciesId)) {
        const failure = ApiResponseFactory.failure(400, "Invalid species id")
        return Response.json(failure, { status: failure.statusCode })
    }

    const response = await speciesService.findSpeciesDetail(speciesId)
    return Response.json(response, { status: response.statusCode })
}
