import { TeamTypeCoverageEntry, TeamTypeSegment } from "@/src/domains/pokemon-management/team/helpers/team-analysis.helper"


export interface TypeCoveragePanelComponentProps {
    readonly moveTypeSegments: TeamTypeSegment[]
    readonly checklist: TeamTypeCoverageEntry[]
}
