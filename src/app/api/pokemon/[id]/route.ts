import { ApiResponseFactory } from "@/src/domains/shared/factories/api-response.factory"
import { pokemonService } from "@/src/domains/pokemon-management/pokemon/services/pokemon.service"
import { EditPokemonPartialValidationSchema } from "@/src/domains/pokemon-management/pokemon/validation-schemas/edit-pokemon-partial.validation-schema"


function parsePokemonId(id: string): number | null {
    const pokemonId = Number.parseInt(id, 10)
    return Number.isNaN(pokemonId) ? null : pokemonId
}

function invalidIdResponse() {
    const failure = ApiResponseFactory.failure(400, "Invalid Pokemon id")
    return Response.json(failure, { status: failure.statusCode })
}


export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {

    const { id } = await params
    const pokemonId = parsePokemonId(id)
    if (pokemonId === null) return invalidIdResponse()

    const response = await pokemonService.findUniquePokemon(pokemonId)
    return Response.json(response, { status: response.statusCode })
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {

    const { id } = await params
    const pokemonId = parsePokemonId(id)
    if (pokemonId === null) return invalidIdResponse()

    const body = await request.json().catch(() => null)
    const parsed = EditPokemonPartialValidationSchema.safeParse(body)

    if (!parsed.success) {
        const failure = ApiResponseFactory.failure(400, parsed.error.issues[0]?.message ?? "Invalid Pokemon data")
        return Response.json(failure, { status: failure.statusCode })
    }

    const response = await pokemonService.editPokemon({ pokemonId, ...parsed.data })
    return Response.json(response, { status: response.statusCode })
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {

    const { id } = await params
    const pokemonId = parsePokemonId(id)
    if (pokemonId === null) return invalidIdResponse()

    const response = await pokemonService.removePokemon(pokemonId)
    return Response.json(response, { status: response.statusCode })
}
