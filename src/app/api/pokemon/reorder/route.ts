import { ApiResponseFactory } from "@/src/domains/shared/factories/api-response.factory"
import { pokemonService } from "@/src/domains/pokemon-management/pokemon/services/pokemon.service"


export async function PATCH(request: Request) {

    const body = await request.json().catch(() => null)

    const spaceId = Number.parseInt(`${body?.spaceId}`, 10)
    const orderedIds = Array.isArray(body?.orderedIds)
        ? body.orderedIds.filter((id: unknown) => typeof id === "number")
        : null

    if (Number.isNaN(spaceId) || !orderedIds || orderedIds.length === 0) {
        const failure = ApiResponseFactory.failure(400, "spaceId and a non-empty orderedIds array are required")
        return Response.json(failure, { status: failure.statusCode })
    }

    const response = await pokemonService.reorderPokemon(spaceId, orderedIds)
    return Response.json(response, { status: response.statusCode })
}
