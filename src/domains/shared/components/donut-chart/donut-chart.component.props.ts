export interface DonutChartSegment {
    readonly label: string
    readonly value: number
    readonly percentage: number
    readonly color: string
}

export interface DonutChartComponentProps {
    readonly segments: DonutChartSegment[]
    readonly centerValue?: string
    readonly centerLabel?: string
    readonly emptyMessage?: string
}
