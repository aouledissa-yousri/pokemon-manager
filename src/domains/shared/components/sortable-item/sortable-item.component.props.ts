import { ReactNode } from "react"


export interface SortableItemComponentProps {
    readonly id: number
    readonly data?: Record<string, unknown>
    readonly children: ReactNode
}
