export interface TrainerApiResponse {
    readonly id: number
    readonly name: string
    readonly image: string | null
    readonly pokemonCount: number
    readonly createdAt: string
}
