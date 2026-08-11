import { ApiResponseFactory } from "@/src/domains/shared/factories/api-response.factory"
import { pokemonService } from "@/src/domains/pokemon-management/pokemon/services/pokemon.service"


export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {

    const { id } = await params
    const pokemonId = Number.parseInt(id, 10)

    if (Number.isNaN(pokemonId)) {
        const failure = ApiResponseFactory.failure(400, "Invalid Pokemon id")
        return Response.json(failure, { status: failure.statusCode })
    }

    const body = await request.json().catch(() => null)
    const targetTrainerId = Number.parseInt(`${body?.targetTrainerId}`, 10)

    if (Number.isNaN(targetTrainerId)) {
        const failure = ApiResponseFactory.failure(400, "A valid targetTrainerId is required")
        return Response.json(failure, { status: failure.statusCode })
    }

    const parsedTargetSpaceId = Number.parseInt(`${body?.targetSpaceId}`, 10)
    const targetSpaceId = Number.isNaN(parsedTargetSpaceId) ? undefined : parsedTargetSpaceId

    const response = await pokemonService.copyPokemon({ pokemonId, targetTrainerId, targetSpaceId })
    return Response.json(response, { status: response.statusCode })
}
