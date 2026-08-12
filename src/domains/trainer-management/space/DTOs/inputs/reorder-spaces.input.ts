export interface ReorderSpacesInput {
    readonly trainerId: number
    readonly parentSpaceId: number | null
    readonly orderedIds: number[]
}
