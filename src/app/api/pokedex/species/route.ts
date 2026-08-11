import { speciesService } from "@/src/domains/pokedex/species/services/species.service"


export async function GET() {
    const response = await speciesService.findSpeciesList()
    return Response.json(response, { status: response.statusCode })
}
