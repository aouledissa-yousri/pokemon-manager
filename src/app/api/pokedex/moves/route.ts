import { moveService } from "@/src/domains/pokedex/move/services/move.service"


export async function GET() {
    const response = await moveService.findMoveList()
    return Response.json(response, { status: response.statusCode })
}
