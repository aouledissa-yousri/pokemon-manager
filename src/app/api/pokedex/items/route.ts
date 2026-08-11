import { itemService } from "@/src/domains/pokedex/item/services/item.service"


export async function GET() {
    const response = await itemService.findItemList()
    return Response.json(response, { status: response.statusCode })
}
