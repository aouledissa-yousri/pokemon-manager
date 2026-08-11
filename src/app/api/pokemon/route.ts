import { ApiResponseFactory } from "@/src/domains/shared/factories/api-response.factory"
import { pokemonService } from "@/src/domains/pokemon-management/pokemon/services/pokemon.service"
import { AddPokemonValidationSchema } from "@/src/domains/pokemon-management/pokemon/validation-schemas/add-pokemon.validation-schema"


export async function GET(request: Request) {

    const spaceId = Number.parseInt(new URL(request.url).searchParams.get("spaceId") ?? "", 10)

    if (Number.isNaN(spaceId)) {
        const failure = ApiResponseFactory.failure(400, "A valid spaceId query parameter is required")
        return Response.json(failure, { status: failure.statusCode })
    }

    const response = await pokemonService.findPokemonList(spaceId)
    return Response.json(response, { status: response.statusCode })
}

export async function POST(request: Request) {

    const body = await request.json().catch(() => null)
    const parsed = AddPokemonValidationSchema.safeParse(body)

    if (!parsed.success) {
        const failure = ApiResponseFactory.failure(400, parsed.error.issues[0]?.message ?? "Invalid Pokemon data")
        return Response.json(failure, { status: failure.statusCode })
    }

    const response = await pokemonService.addPokemon(parsed.data)
    return Response.json(response, { status: response.statusCode })
}
