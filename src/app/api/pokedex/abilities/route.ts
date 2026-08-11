import { abilityService } from "@/src/domains/pokedex/ability/services/ability.service"


export async function GET() {
    const response = await abilityService.findAbilityList()
    return Response.json(response, { status: response.statusCode })
}
