import { StatEnum } from "@/src/domains/pokemon-management/pokemon/enums/stat.enum"


export interface StatRowComponentProps {
    readonly stat: StatEnum
    readonly baseValue: number
    readonly calculatedValue: number
    readonly natureDirection: "increased" | "decreased" | null
    readonly iv: number
    readonly ev: number
    readonly onIvChange: (value: number) => void
    readonly onEvChange: (value: number) => void
}
