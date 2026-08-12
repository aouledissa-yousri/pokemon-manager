export interface AddSpaceInput {
    readonly trainerId: number
    readonly parentSpaceId: number | null
    readonly name: string
    readonly metLocation: string
}
